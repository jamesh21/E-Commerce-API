const pool = require('../db'); // Import the database connection
const { StatusCodes } = require('http-status-codes')
const { ConflictError, BadRequestError, NotFoundError } = require('../errors')


const getCartItems = async (req, res) => {
    res.send('get cart items')
}
const addCartItem = async (req, res) => {
    // Need prodcut id, cart id and quantity?
    res.send('add to cart')
}

const removeCartItem = async (req, res) => {
    res.send('remove product from cart')
}

const updateCartItemQuantity = async (req, res) => {
    res.send('update item quantity')
}


module.exports = { addCartItem, removeCartItem, getCartItems, updateCartItemQuantity }