CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'farmer'))
);


INSERT INTO users (email, password, name, role)
VALUES
('admin1@example.com', 'hashed_password_1', 'Admin One', 'admin'),
('admin2@example.com', 'hashed_password_2', 'Admin Two', 'admin');

INSERT INTO users (email, password, name, role)
VALUES
('farmer1@example.com', 'hashed_password_3', 'Farmer One', 'farmer'),
('farmer2@example.com', 'hashed_password_4', 'Farmer Two', 'farmer'),
('farmer3@example.com', 'hashed_password_5', 'Farmer Three', 'farmer');