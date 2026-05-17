CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'farmer'))
);

-- Farm Table (owned by admin, worked on by farmers)
CREATE TABLE farm (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    size NUMERIC NOT NULL,
    location TEXT NOT NULL,
    soil_type TEXT,
    planting_date DATE,
    harvest_date DATE
);

-- Farmer WorksOn Farm (relationship) - farmers work on farms
CREATE TABLE works_on_farm (
    farmer_id INT NOT NULL,
    farm_id INT NOT NULL,
    PRIMARY KEY (farmer_id, farm_id),
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES farm(id) ON DELETE CASCADE
);

-- Field Table
CREATE TABLE field (
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    name TEXT NOT NULL,
    area NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('Plant', 'Growth', 'Harvest')),
    FOREIGN KEY (farm_id) REFERENCES farm(id) ON DELETE CASCADE
);

-- Crop Table
CREATE TABLE crop (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    growth_duration INT NOT NULL,
    local_temp NUMERIC,
    ideal_moisture NUMERIC
);

-- Field Contains Crop (relationship)
CREATE TABLE contains (
    field_id INT NOT NULL,
    crop_id INT NOT NULL,
    PRIMARY KEY (field_id, crop_id),
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crop(id) ON DELETE CASCADE
);

-- Crop Planted_in Field (relationship)
CREATE TABLE planted_in (
    crop_id INT NOT NULL,
    field_id INT NOT NULL,
    PRIMARY KEY (crop_id, field_id),
    FOREIGN KEY (crop_id) REFERENCES crop(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE
);

-- Machine Table
CREATE TABLE machine (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('idle', 'working', 'maintain'))
);

-- Machine WorksOn Farm (relationship)
CREATE TABLE works_on_farm_machine (
    farm_id INT NOT NULL,
    machine_id INT NOT NULL,
    PRIMARY KEY (farm_id, machine_id),
    FOREIGN KEY (farm_id) REFERENCES farm(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machine(id) ON DELETE CASCADE
);

-- Machine WorksOn Field (relationship)
CREATE TABLE works_on_field (
    field_id INT NOT NULL,
    machine_id INT NOT NULL,
    PRIMARY KEY (field_id, machine_id),
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machine(id) ON DELETE CASCADE
);

-- IoT_Sensor Table
CREATE TABLE iot_sensor (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('Temp', 'Humidity', 'Moist')),
    status TEXT NOT NULL,
    install_date DATE NOT NULL,
    sensor_id TEXT UNIQUE
);

-- Field Installed_in IoT_Sensor (relationship)
CREATE TABLE installed_in (
    field_id INT NOT NULL,
    sensor_id INT NOT NULL,
    PRIMARY KEY (field_id, sensor_id),
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES iot_sensor(id) ON DELETE CASCADE
);

-- Sensor_data Table
CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    reading_time TIMESTAMP NOT NULL
);

-- IoT_Sensor Generates Sensor_data (relationship)
CREATE TABLE generates (
    sensor_id INT NOT NULL,
    sensor_data_id INT NOT NULL,
    PRIMARY KEY (sensor_id, sensor_data_id),
    FOREIGN KEY (sensor_id) REFERENCES iot_sensor(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_data_id) REFERENCES sensor_data(id) ON DELETE CASCADE
);

-- Alert Table
CREATE TABLE alert (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High'))
);

-- Alert Triggers Sensor_data (relationship)
CREATE TABLE triggers (
    alert_id INT NOT NULL,
    sensor_data_id INT NOT NULL,
    PRIMARY KEY (alert_id, sensor_data_id),
    FOREIGN KEY (alert_id) REFERENCES alert(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_data_id) REFERENCES sensor_data(id) ON DELETE CASCADE
);


-- seed data
-- =========================
-- USERS
-- =========================
INSERT INTO users (email, password, name, role) VALUES
('admin@farm.com', 'hashed_password_1', 'Main Admin', 'admin'),
('farmer1@farm.com', 'hashed_password_2', 'Ali Farmer', 'farmer'),
('farmer2@farm.com', 'hashed_password_3', 'Ayse Farmer', 'farmer');

-- =========================
-- FARM
-- =========================
INSERT INTO farm (name, size, location, soil_type, planting_date, harvest_date) VALUES
('Green Valley Farm', 120.5, 'Mersin', 'Loamy', '2026-03-01', '2026-09-01'),
('Sunrise Fields', 80.0, 'Adana', 'Sandy', '2026-02-15', '2026-08-20');

-- =========================
-- WORKS_ON_FARM (farmers assigned to farms)
-- =========================
INSERT INTO works_on_farm (farmer_id, farm_id) VALUES
(2, 1),
(3, 1),
(3, 2);

-- =========================
-- FIELD
-- =========================
INSERT INTO field (farm_id, name, area, status) VALUES
(1, 'North Field', 40.0, 'Plant'),
(1, 'South Field', 60.0, 'Growth'),
(2, 'East Field', 30.0, 'Harvest');

-- =========================
-- CROP
-- =========================
INSERT INTO crop (name, growth_duration, local_temp, ideal_moisture) VALUES
('Wheat', 120, 22.5, 60),
('Corn', 90, 25.0, 55),
('Tomato', 75, 24.0, 70);

-- =========================
-- CONTAINS (field-crop availability)
-- =========================
INSERT INTO contains (field_id, crop_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 2);

-- =========================
-- PLANTED_IN (active crops)
-- =========================
INSERT INTO planted_in (crop_id, field_id) VALUES
(1, 1),
(3, 2),
(2, 3);

-- =========================
-- MACHINE
-- =========================
INSERT INTO machine (name, type, status) VALUES
('Tractor A1', 'Tractor', 'working'),
('Irrigation Pump X', 'Irrigation', 'idle'),
('Harvester Z', 'Harvester', 'maintain');

-- =========================
-- WORKS_ON_FARM_MACHINE
-- =========================
INSERT INTO works_on_farm_machine (farm_id, machine_id) VALUES
(1, 1),
(1, 2),
(2, 3);

-- =========================
-- WORKS_ON_FIELD (machines used on fields)
-- =========================
INSERT INTO works_on_field (field_id, machine_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- =========================
-- IOT_SENSOR
-- =========================
INSERT INTO iot_sensor (type, status, install_date, sensor_id) VALUES
('Temp', 'active', '2026-01-10', 'SEN-T-001'),
('Humidity', 'active', '2026-01-12', 'SEN-H-002'),
('Moist', 'inactive', '2026-01-15', 'SEN-M-003');

-- =========================
-- INSTALLED_IN
-- =========================
INSERT INTO installed_in (field_id, sensor_id) VALUES
(1, 1),
(1, 2),
(2, 3);

-- =========================
-- SENSOR_DATA
-- =========================
INSERT INTO sensor_data (value, unit, reading_time) VALUES
(23.5, 'C', '2026-05-16 10:00:00'),
(55.0, '%', '2026-05-16 10:05:00'),
(61.2, '%', '2026-05-16 10:10:00');

-- =========================
-- GENERATES (sensor -> data)
-- =========================
INSERT INTO generates (sensor_id, sensor_data_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- =========================
-- ALERT
-- =========================
INSERT INTO alert (message, timestamp, severity) VALUES
('Temperature too high in North Field', '2026-05-16 10:15:00', 'High'),
('Humidity stable', '2026-05-16 10:20:00', 'Low');

-- =========================
-- TRIGGERS (alert -> sensor data)
-- =========================
INSERT INTO triggers (alert_id, sensor_data_id) VALUES
(1, 1),
(2, 2);

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



-- =========================================================
-- 1. Automatically update machine status to 'working'
--    when a machine is assigned to a field
-- =========================================================
CREATE OR REPLACE FUNCTION set_machine_working()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE machine
    SET status = 'working'
    WHERE id = NEW.machine_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_machine_working
AFTER INSERT ON works_on_field
FOR EACH ROW
EXECUTE FUNCTION set_machine_working();


-- =========================================================
-- 2. Automatically update field status to 'Growth'
--    when a crop is planted in the field
-- =========================================================
CREATE OR REPLACE FUNCTION set_field_growth()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE field
    SET status = 'Growth'
    WHERE id = NEW.field_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_field_growth
AFTER INSERT ON planted_in
FOR EACH ROW
EXECUTE FUNCTION set_field_growth();


-- =========================================================
-- 3. Prevent duplicate user emails (custom error message)
-- =========================================================
CREATE OR REPLACE FUNCTION check_duplicate_email()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM users
        WHERE email = NEW.email
          AND id <> COALESCE(NEW.id, 0)
    ) THEN
        RAISE EXCEPTION 'Email % is already registered.', NEW.email;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_duplicate_email
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION check_duplicate_email();


-- =========================================================
-- 4. Automatically set field status to 'Harvest'
--    when the farm's harvest date is reached
-- =========================================================
CREATE OR REPLACE FUNCTION update_field_harvest_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.harvest_date IS NOT NULL
       AND NEW.harvest_date <= CURRENT_DATE THEN
        UPDATE field
        SET status = 'Harvest'
        WHERE farm_id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_field_harvest_status
AFTER INSERT OR UPDATE ON farm
FOR EACH ROW
EXECUTE FUNCTION update_field_harvest_status();