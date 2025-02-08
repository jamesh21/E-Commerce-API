CREATE DATABASE ecommerce;

-- User Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email_address VARCHAR(320) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Product Table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 0,
    price NUMERIC(10,2) NOT NULL,
    product_sku VARCHAR(25) UNIQUE NOT NULL
);

-- Cart Table
CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Carts Items Table
CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(cart_id) ON DELETE CASCADE  NOT NULL ,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE NOT NULL,
    quantity INT CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(cart_id, product_id) -- Prevents duplicate items in a cart
);