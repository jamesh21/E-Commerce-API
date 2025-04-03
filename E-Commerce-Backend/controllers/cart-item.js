const { StatusCodes } = require('http-status-codes')
const cartService = require('../services/cart-service')

/**
 * Retrieves all cart items for this users cart
 * @param {*} req 
 * @param {*} res 
 */
const getCartItems = async (req, res) => {
    const { cartId } = req.user

    const cartItems = await cartService.getCartItems(cartId)

    return res.status(StatusCodes.OK).json(cartItems)
}

/**
 * Adds an item to users cart
 * @param {*} req 
 * @param {*} res 
 */
const addCartItem = async (req, res) => {
    const { productId, quantity } = req.body
    const { cartId } = req.user

    const cartItem = await cartService.addCartItem(cartId, productId, quantity)

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

    const cartItem = await cartService.updateCartItemQuantity(quantity, cartItemId, cartId)

    return res.status(StatusCodes.OK).json(cartItem)
}

/**
 * Removes the passed in cart item for user's cart
 * @param {*} req 
 * @param {*} res 
 */
const removeCartItem = async (req, res) => {
    const { cartId } = req.user
    const { cartItemId } = req.params

    const removedCartItem = await cartService.removeCartItem(cartItemId, cartId)

    return res.status(StatusCodes.OK).json(removedCartItem)
}

/**
 * Clears the user's cart
 * @param {*} req 
 * @param {*} res 
 */
const clearCart = async (req, res) => {
    const { cartId } = req.user

    const clearedCart = await cartModel.clearCart(cartId)

    return res.status(StatusCodes.OK).json(clearedCart)
}


module.exports = { addCartItem, removeCartItem, getCartItems, updateCartItemQuantity, clearCart }