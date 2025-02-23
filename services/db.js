const pool = require('../db'); // Import the database connection


const getCartItemsFromDB = async (cartId) => {
    const cartItems = await pool.query('SELECT ci.cart_item_id, p.product_sku, p.product_name, p.price, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id=p.product_id WHERE ci.cart_id=($1)', [cartId])
    return cartItems.rows
}

const createOrderInDB = async (userId, totalPrice) => {
    const order = await pool.query('INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *', [userId, totalPrice])
    return order.rows[0].order_id
}

const addUserToDB = async (email, hashedPassword, name, admin) => {
    const user = await pool.query('INSERT INTO users (email_address, password_hash, full_name, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, hashedPassword, name, admin]
    )
    return user
}

const getUserFromDB = async (email) => {
    const user = await pool.query('SELECT * FROM users WHERE email_address = ($1)', [email])
    return user
}

const addCartToDB = async (userId) => {
    const newCart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId])
    return newCart
}

const getCartFromDB = async (userId) => {
    const cart = await pool.query('SELECT cart_id FROM carts WHERE user_id = ($1)', [userId])
    return cart
}

module.exports = { addUserToDB, getUserFromDB, getCartItemsFromDB, createOrderInDB, addCartToDB, getCartFromDB }