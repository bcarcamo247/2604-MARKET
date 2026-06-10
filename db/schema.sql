/*lines 2-5 deletes the following tables if they exist*/
DROP TABLE IF EXISTS orders_products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
/*The structure of the database, the tables are created with
the following names while data is stored within them*/
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password text NOT NULL
);

CREATE TABLE products (
    id serial PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    price decimal NOT NULL
);

CREATE TABLE orders (
    id serial PRIMARY KEY,
    date DATE NOT NULL,
    note text,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
/*creates relationship between orders and products*/
CREATE TABLE orders_products (
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

