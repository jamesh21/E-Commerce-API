const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const { getCartItemsFromDB, addCartItemToDB, updateCartItemQuantityInDB, removeCartItemFromDB, clearCartItemForUserInDB } = require('../services/db')

/**
 * Retrieves all cart items for this users cart
 * @param {*} req 
 * @param {*} res 
 */
const getCartItems = async (req, res) => {
    const { cartId } = req.user
    const cartItems = await getCartItemsFromDB(cartId)
    console.log('cart items ', cartItems)
    res.status(StatusCodes.OK).json(cartItems)
}

/**
 * Adds an item to users cart
 * @param {*} req 
 * @param {*} res 
 */
const addCartItem = async (req, res) => {
    const { productId, quantity } = req.body
    const { cartId } = req.user
    if (!productId || !quantity) {
        throw new BadRequestError('product id or quantity is missing')
    }
    const cartItem = await addCartItemToDB(cartId, productId, quantity)

    return res.status(StatusCodes.CREATED).json(cartItem)
}

/**
 * Updates the quantity of this user's cart item
 * @param {*} req 
 * @param {*} res 
 */
const updateCartItemQuantity = async (req, res) => {
    const { cartItemId } = req.params
    const { cartId } = req.user
    const { quantity } = req.body
    if (quantity <= 0) {
        throw new BadRequestError('Quantity entered must be greater than 0')
    }
    const cartItem = await updateCartItemQuantityInDB(quantity, cartItemId, cartId)

    res.status(StatusCodes.OK).json(cartItem)
}

/**
 * Removes the passed in cart item for user's cart
 * @param {*} req 
 * @param {*} res 
 */
const removeCartItem = async (req, res) => {
    const { cartId } = req.user
    const { cartItemId } = req.params
    const result = await removeCartItemFromDB(cartItemId, cartId)

    res.status(StatusCodes.OK).json(result)
}

/**
 * Clears the user's cart
 * @param {*} req 
 * @param {*} res 
 */
const clearCart = async (req, res) => {
    const { cartId } = req.user
    const result = await clearCartItemForUserInDB(cartId)

    res.status(StatusCodes.OK).json(result)
}


module.exports = { addCartItem, removeCartItem, getCartItems, updateCartItemQuantity, clearCart }