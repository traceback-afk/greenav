CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'farmer'))
);


-- INSERT INTO users (email, password, name, role)
-- VALUES
-- ('admin1@example.com', 'hashed_password_1', 'Admin One', 'admin'),
-- ('admin2@example.com', 'hashed_password_2', 'Admin Two', 'admin');

-- INSERT INTO users (email, password, name, role)
-- VALUES
-- ('farmer1@example.com', 'hashed_password_3', 'Farmer One', 'farmer'),
-- ('farmer2@example.com', 'hashed_password_4', 'Farmer Two', 'farmer'),
-- ('farmer3@example.com', 'hashed_password_5', 'Farmer Three', 'farmer');

-- Farm Table
CREATE TABLE farm (
    id SERIAL PRIMARY KEY,
    farmer_id INT NOT NULL,
    name TEXT NOT NULL,
    size NUMERIC NOT NULL,
    location TEXT NOT NULL,
    soil_type TEXT,
    planting_date DATE,
    harvest_date DATE,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Machine Table
CREATE TABLE machine (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('idle', 'working', 'maintain'))
);

-- Machine WorksOn Farm (relationship)
CREATE TABLE works_on_farm (
    farm_id INT NOT NULL,
    machine_id INT NOT NULL,
    PRIMARY KEY (farm_id, machine_id),
    FOREIGN KEY (farm_id) REFERENCES farm(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machine(id) ON DELETE CASCADE
);

-- Field Table
CREATE TABLE field (
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    name TEXT NOT NULL,
    area NUMERIC NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES farm(id) ON DELETE CASCADE
);

-- Field Contains Crop (relationship)
CREATE TABLE contains (
    field_id INT NOT NULL,
    crop_id INT NOT NULL,
    PRIMARY KEY (field_id, crop_id),
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crop(id) ON DELETE CASCADE
);

-- Field Installed_in IoT_Sensor (relationship)
CREATE TABLE installed_in (
    field_id INT NOT NULL,
    sensor_id INT NOT NULL,
    PRIMARY KEY (field_id, sensor_id),
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES iot_sensor(id) ON DELETE CASCADE
);

-- Machine WorksOn Field (relationship)
CREATE TABLE works_on_field (
    field_id INT NOT NULL,
    machine_id INT NOT NULL,
    PRIMARY KEY (field_id, machine_id),
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machine(id) ON DELETE CASCADE
);

-- Crop Table
CREATE TABLE crop (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    growth_duration INT NOT NULL,
    local_temp NUMERIC,
    ideal_moisture NUMERIC
);

-- Crop Planted_in Field (relationship)
CREATE TABLE planted_in (
    crop_id INT NOT NULL,
    field_id INT NOT NULL,
    PRIMARY KEY (crop_id, field_id),
    FOREIGN KEY (crop_id) REFERENCES crop(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE
);

-- IoT_Sensor Table
CREATE TABLE iot_sensor (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('Temp', 'Humidity', 'Moist')),
    status TEXT NOT NULL,
    install_date DATE NOT NULL
);

-- IoT_Sensor Generates Sensor_data (relationship)
CREATE TABLE generates (
    sensor_id INT NOT NULL,
    sensor_data_id INT NOT NULL,
    PRIMARY KEY (sensor_id, sensor_data_id),
    FOREIGN KEY (sensor_id) REFERENCES iot_sensor(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_data_id) REFERENCES sensor_data(id) ON DELETE CASCADE
);

-- Sensor_data Table
CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    reading_time TIMESTAMP NOT NULL
);

-- Alert Table
CREATE TABLE alert (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High'))
);

-- Alert Triggers by Alert_trigger (relationship)
CREATE TABLE alert_trigger (
    alert_id INT NOT NULL,
    PRIMARY KEY (alert_id),
    FOREIGN KEY (alert_id) REFERENCES alert(id) ON DELETE CASCADE
);

-- Alert_trigger connected to Sensor_data
CREATE TABLE trigger_sensor (
    trigger_id INT NOT NULL,
    sensor_data_id INT NOT NULL,
    PRIMARY KEY (trigger_id, sensor_data_id),
    FOREIGN KEY (trigger_id) REFERENCES alert_trigger(alert_id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_data_id) REFERENCES sensor_data(id) ON DELETE CASCADE
);