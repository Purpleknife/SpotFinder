DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  password_confirmation VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  city VARCHAR(255),
  province VARCHAR(255),
  country VARCHAR(255)
);