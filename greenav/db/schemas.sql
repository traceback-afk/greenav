CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'farmer'))
);


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


-- seed data

-- Users
INSERT INTO users (email, password, name, role) VALUES
('admin@smartfarm.com', '$2b$10$hashed_admin_password', 'System Admin', 'admin'),
('john@farm.com', '$2b$10$hashed_farmer_password', 'John Doe', 'farmer'),
('sarah@farm.com', '$2b$10$hashed_farmer_password', 'Sarah Smith', 'farmer');

-- Farms
INSERT INTO farm (farmer_id, name, size, location, soil_type, planting_date, harvest_date) VALUES
(2, 'Green Valley Farm', 120.5, 'Mersin, Türkiye', 'Loamy', '2026-03-01', '2026-08-15'),
(2, 'Sunrise Farm', 75.0, 'Adana, Türkiye', 'Clay', '2026-04-10', '2026-09-20'),
(3, 'Golden Harvest Farm', 200.0, 'Antalya, Türkiye', 'Sandy Loam', '2026-02-20', '2026-07-30');

-- Machines
INSERT INTO machine (name, type, status) VALUES
('John Deere 5075E', 'Tractor', 'working'),
('Case IH Axial-Flow', 'Harvester', 'idle'),
('Kubota M7060', 'Tractor', 'maintain'),
('DJI Agras T40', 'Drone Sprayer', 'working'),
('New Holland BB1290', 'Baler', 'idle');

-- Works on Farm
INSERT INTO works_on_farm (farm_id, machine_id) VALUES
(1, 1),
(1, 4),
(2, 3),
(3, 2),
(3, 5);

-- Fields
INSERT INTO field (farm_id, name, area) VALUES
(1, 'North Field', 50.0),
(1, 'South Field', 70.5),
(2, 'East Field', 75.0),
(3, 'Main Field', 120.0),
(3, 'West Field', 80.0);

-- Crops
INSERT INTO crop (name, growth_duration, local_temp, ideal_moisture) VALUES
('Wheat', 120, 22.5, 45.0),
('Corn', 90, 28.0, 60.0),
('Tomato', 75, 24.0, 70.0),
('Cotton', 180, 30.0, 50.0),
('Barley', 110, 20.0, 40.0);

-- Contains (Field contains Crop)
INSERT INTO contains (field_id, crop_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Planted In (same relationships as contains)
INSERT INTO planted_in (crop_id, field_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- IoT Sensors
INSERT INTO iot_sensor (type, status, install_date) VALUES
('Temp', 'active', '2026-01-15'),
('Humidity', 'active', '2026-01-16'),
('Moist', 'active', '2026-01-17'),
('Temp', 'inactive', '2026-02-01'),
('Moist', 'active', '2026-02-05');

-- Installed In (Field installed with sensors)
INSERT INTO installed_in (field_id, sensor_id) VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 4),
(4, 5);

-- Works on Field
INSERT INTO works_on_field (field_id, machine_id) VALUES
(1, 1),
(2, 4),
(3, 3),
(4, 2),
(5, 5);

-- Sensor Data
INSERT INTO sensor_data (value, unit, reading_time) VALUES
(24.5, '°C', '2026-05-15 08:00:00'),
(65.0, '%', '2026-05-15 08:05:00'),
(42.3, '%', '2026-05-15 08:10:00'),
(31.2, '°C', '2026-05-15 08:15:00'),
(28.7, '%', '2026-05-15 08:20:00');

-- Generates (Sensor generates Sensor Data)
INSERT INTO generates (sensor_id, sensor_data_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Alerts
INSERT INTO alert (message, timestamp, severity) VALUES
('Soil moisture is below optimal level in North Field.', '2026-05-15 08:15:00', 'Medium'),
('Temperature exceeds safe threshold in East Field.', '2026-05-15 08:20:00', 'High'),
('Humidity level slightly below recommended range.', '2026-05-15 08:25:00', 'Low');

-- Alert Triggers
INSERT INTO alert_trigger (alert_id) VALUES
(1),
(2),
(3);

-- Trigger Sensor (which sensor data caused each alert)
INSERT INTO trigger_sensor (trigger_id, sensor_data_id) VALUES
(1, 3),
(2, 4),
(3, 2);







-- sensor alert trigger

-- Function: Create alerts automatically when sensor data is inserted
CREATE OR REPLACE FUNCTION check_sensor_alert()
RETURNS TRIGGER AS $$
DECLARE
    sensor_type TEXT;
    alert_message TEXT;
    alert_severity TEXT;
    new_alert_id INT;
BEGIN
    -- Find the sensor type that generated this sensor_data row
    SELECT s.type
    INTO sensor_type
    FROM generates g
    JOIN iot_sensor s ON s.id = g.sensor_id
    WHERE g.sensor_data_id = NEW.id
    LIMIT 1;

    -- If no sensor is linked yet, do nothing
    IF sensor_type IS NULL THEN
        RETURN NEW;
    END IF;

    -- Temperature sensor rules
    IF sensor_type = 'Temp' THEN
        IF NEW.value > 35 THEN
            alert_message := 'High temperature detected: ' || NEW.value || ' °C';
            alert_severity := 'High';
        ELSIF NEW.value < 5 THEN
            alert_message := 'Low temperature detected: ' || NEW.value || ' °C';
            alert_severity := 'Medium';
        END IF;
    END IF;

    -- Humidity sensor rules
    IF sensor_type = 'Humidity' THEN
        IF NEW.value < 30 THEN
            alert_message := 'Low humidity detected: ' || NEW.value || ' %';
            alert_severity := 'Medium';
        ELSIF NEW.value > 90 THEN
            alert_message := 'High humidity detected: ' || NEW.value || ' %';
            alert_severity := 'Low';
        END IF;
    END IF;

    -- Soil moisture sensor rules
    IF sensor_type = 'Moist' THEN
        IF NEW.value < 25 THEN
            alert_message := 'Critical low soil moisture: ' || NEW.value || ' %';
            alert_severity := 'High';
        ELSIF NEW.value < 40 THEN
            alert_message := 'Low soil moisture detected: ' || NEW.value || ' %';
            alert_severity := 'Medium';
        ELSIF NEW.value > 85 THEN
            alert_message := 'Excessive soil moisture detected: ' || NEW.value || ' %';
            alert_severity := 'Low';
        END IF;
    END IF;

    -- If an alert condition was met, create the alert and relationships
    IF alert_message IS NOT NULL THEN
        -- Insert into alert table
        INSERT INTO alert (message, timestamp, severity)
        VALUES (alert_message, NEW.reading_time, alert_severity)
        RETURNING id INTO new_alert_id;

        -- Insert into alert_trigger table
        INSERT INTO alert_trigger (alert_id)
        VALUES (new_alert_id);

        -- Link trigger to the sensor data that caused it
        INSERT INTO trigger_sensor (trigger_id, sensor_data_id)
        VALUES (new_alert_id, NEW.id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger: Runs after a new relationship is created between sensor and sensor_data
-- This is the correct place because the sensor type is only known after inserting into generates
CREATE OR REPLACE TRIGGER trg_check_sensor_alert
AFTER INSERT ON generates
FOR EACH ROW
EXECUTE FUNCTION check_sensor_alert();