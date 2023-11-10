
CREATE TABLE  shoes (
    id SERIAL PRIMARY KEY,
    color VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    size INTEGER NOT NULL,
    in_stock INTEGER NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL
);

CREATE TABLE shoes_cart (
    user_id INTEGER REFERENCES users(id),
    shoe_id INTEGER REFERENCES shoes(id),
    price = (SELECT price FROM shoes WHERE shoes.id = shoes_cart.shoe_id) * quantity DECIMAL(10, 2)
    quantity INTEGER,
    PRIMARY KEY (user_id, shoe_id)
);