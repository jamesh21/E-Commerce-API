const pool = require('../db'); // Import the database connection
const { StatusCodes } = require('http-status-codes')
const { ConflictError, BadRequestError, NotFoundError } = require('../errors')

const createNewCart = async (req, res) => {
    const { userId } = req.user
    try {
        const cart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId])
        return res.status(StatusCodes.CREATED).json(cart.rows[0])
    } catch (err) {
        if (err.code === '23505') {
            throw new ConflictError('cart for this user already exists')
        }
        throw err
    }
}

const getCart = async (req, res) => {
    // Retrieve cart from logging in user
    res.send('Get Cart')
}


const clearCart = async (req, res) => {
    res.send('remove all from cart')
}

module.exports = { getCart, createNewCart, clearCart }