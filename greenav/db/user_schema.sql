CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE admins (
    user_id INTEGER PRIMARY KEY,
    salary NUMERIC,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE farmers (
    user_id INTEGER PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


WITH new_user AS (
    INSERT INTO users (email, password, name)
    VALUES ('admin@test.com', 'hashed_password', 'Admin User')
    RETURNING id
)
INSERT INTO admins (user_id, salary)
SELECT id, 5000 FROM new_user;


WITH new_user AS (
    INSERT INTO users (email, password, name)
    VALUES ('farmer@test.com', 'hashed_password', 'Farmer User')
    RETURNING id
)
INSERT INTO farmers (user_id)
SELECT id FROM new_user;