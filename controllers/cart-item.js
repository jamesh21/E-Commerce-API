const pool = require('../db'); // Import the database connection
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

/**
 * Retrieves all cart items for this users cart
 * @param {*} req 
 * @param {*} res 
 */
const getCartItems = async (req, res) => {
    const { cartId } = req.user
    const cartItems = await pool.query('SELECT ci.cart_item_id, p.product_sku, p.product_name, p.price, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id = p.product_id WHERE ci.cart_id = ($1)'
        , [cartId]
    )
    const result = { data: cartItems.rows, count: cartItems.rowCount }
    res.status(StatusCodes.OK).json(result)
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
    try {
        // attemps to add item to cart, if already present increment quantity instead.
        const cartItem = await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity RETURNING *'
            , [cartId, productId, quantity])
        res.status(StatusCodes.CREATED).json(cartItem.rows[0])
    } catch (err) {
        if (err.code === '23503') {
            throw new NotFoundError('product does not exist')
        }
        throw err
    }
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
    const cartItem = await pool.query('UPDATE cart_items SET quantity = ($1) WHERE cart_item_id = ($2) AND cart_id = ($3) RETURNING *', [quantity, cartItemId, cartId])
    if (cartItem.rowCount === 0) {
        throw new NotFoundError('cart item passed in was not found')
    }
    res.status(StatusCodes.OK).json(cartItem.rows[0])
}

/**
 * Removes the passed in cart item for user's cart
 * @param {*} req 
 * @param {*} res 
 */
const removeCartItem = async (req, res) => {
    const { cartId } = req.user
    const { cartItemId } = req.params

    const cartItem = await pool.query('DELETE FROM cart_items WHERE cart_item_id = ($1) AND cart_id = ($2)', [cartItemId, cartId])
    if (cartItem.rowCount === 0) {
        throw new NotFoundError('cart item was not found')
    }

    res.status(StatusCodes.OK).json({ msg: `Deleted cart item ${cartItemId} successfully` })
}

/**
 * Clears the user's cart
 * @param {*} req 
 * @param {*} res 
 */
const clearCart = async (req, res) => {
    const { cartId } = req.user
    await pool.query('DELETE FROM cart_items WHERE cart_id = ($1)', [cartId])
    res.status(StatusCodes.OK).json({ msg: 'Cart has been cleared' })
}


module.exports = { addCartItem, removeCartItem, getCartItems, updateCartItemQuantity, clearCart }