const pool = require('../db'); // Import the database connection
const { StatusCodes } = require('http-status-codes')
const { ConflictError, BadRequestError, NotFoundError } = require('../errors')

const createNewCart = async (req, res) => {
    // save cart id
    res.send(' create cart for user')
}

const getCart = async (req, res) => {
    // Retrieve cart from logging in user
    res.send('Get Cart')
}


const clearCart = async (req, res) => {
    res.send('remove all from cart')
}

module.exports = { getCart, createNewCart, clearCart }