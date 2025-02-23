const pool = require('../db'); // Import the database connection


const getCartItemsFromDB = async (cartId) => {
    const cartItems = await pool.query('SELECT ci.cart_item_id, p.product_sku, p.product_name, p.price, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id=p.product_id WHERE ci.cart_id=($1)', [cartId])
    return cartItems.rows
}

const createOrderInDB = async (userId, totalPrice) => {
    const order = await pool.query('INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *', [userId, totalPrice])
    return order.rows[0].order_id
}

module.exports = { getCartItemsFromDB, createOrderInDB }