CREATE SCHEMA  shoe_catalogue;

CREATE TABLE  shoes (
    id SERIAL PRIMARY KEY,
    color VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    size INTEGER NOT NULL,
    in_stock INTEGER NOT NULL
);