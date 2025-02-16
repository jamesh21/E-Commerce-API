const pool = require('../db'); // Import the database connection
const { StatusCodes } = require('http-status-codes')
const { ConflictError, BadRequestError, NotFoundError } = require('../errors')


const getCart = async (req, res) => {
    // Retrieve cart from logging in user
    res.send('Get Cart')
}
const createNewCart = async (req, res) => {
    res.send(' create cart for user')
}
const addToCart = async (req, res) => {
    res.send('add to cart')
}

const removeFromCart = async (req, res) => {
    res.send('remove product from cart')
}


module.exports = { getCart, createNewCart, addToCart, removeFromCart }