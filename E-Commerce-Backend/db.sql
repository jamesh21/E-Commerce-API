CREATE DATABASE ecommerce;

User Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email_address VARCHAR(320) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_admin BOOLEAN
);

-- Product Table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    stock INT DEFAULT 0 CHECK (stock >= 0),
    price NUMERIC(10,2) NOT NULL,
    product_sku VARCHAR(25) UNIQUE NOT NULL,
    image_url VARCHAR(255)
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


CREATE TYPE status_enum as ENUM('pending', 'paid', 'shipped', 'cancelled');

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    total_price NUMERIC(10,2) NOT NULL,
    order_status status_enum DEFAULT 'pending' NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255) NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

create TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL
);

-- Updates updated_at for carts whenever a cart item from that cart is modified
CREATE OR REPLACE FUNCTION update_cart_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE carts SET updated_at = NOW() WHERE cart_id = NEW.cart_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_update_cart_on_item_change
AFTER INSERT OR UPDATE OR DELETE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_cart_timestamp();
