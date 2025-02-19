const pool = require('../db'); // Import the database connection
const { StatusCodes } = require('http-status-codes')
const { ConflictError, BadRequestError, NotFoundError } = require('../errors')


const getCartItems = async (req, res) => {
    const { cartId } = req.user
    const cartItems = await pool.query('SELECT ci.cart_item_id, p.product_sku, p.product_name, p.price, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id = p.product_id WHERE ci.cart_id = ($1)'
        , [cartId]
    )
    res.status(StatusCodes.OK).json(cartItems.rows)
}

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
        // Need prodcut id, cart id and quantity?
        res.status(StatusCodes.CREATED).json(cartItem.rows[0])
    } catch (err) {
        if (err.code === '23503') {
            throw new NotFoundError('product does not exist')
        }
        throw err
    }

}


const removeCartItem = async (req, res) => {
    // const { cartId } = req.user
    const { cartItemId } = req.params
    await pool.query('DELETE FROM cart_items WHERE cart_item_id = ($1)', [cartItemId])
    res.status(StatusCodes.NO_CONTENT).send()
}

const updateCartItemQuantity = async (req, res) => {
    res.send('update item quantity')
}

const clearCart = async (req, res) => {
    const { cartId } = req.user
    await pool.query('DELETE FROM cart_items WHERE cart_id = ($1)', [cartId])
    // if (cart.rowCount === 0) {
    //     throw new NotFoundError('Product sku was not found')
    // }
    res.status(StatusCodes.NO_CONTENT).send()
}


module.exports = { addCartItem, removeCartItem, getCartItems, updateCartItemQuantity, clearCart }