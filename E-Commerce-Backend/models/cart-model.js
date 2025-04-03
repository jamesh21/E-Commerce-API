const pool = require('../db'); // Import the database connection
const { NotFoundError } = require('../errors')
const { transformFields } = require('../utils/field-mapper')
const { DB_TO_API_MAPPING } = require('../constants/field-mappings')

class CartModel {

    /**
     * Retrieves specific cart for user in carts table.
     * @param {*} userId 
     * @returns 
     */
    getCartFromDB = async (userId) => {
        const cart = await pool.query('SELECT cart_id FROM carts WHERE user_id = ($1)', [userId])
        if (cart.rowCount > 0) {
            return transformFields(cart.rows[0], DB_TO_API_MAPPING)
        }
    }


    /**
     * Creates new cart entry for user in carts table.
     * @param {*} userId 
     * @returns 
     */
    addCartToDB = async (userId) => {
        const newCart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId])
        if (newCart.rowCount === 0) {
            throw new Error('Cart could not be created, try again later')
        }
        return transformFields(newCart.rows[0], DB_TO_API_MAPPING)
    }

    /**
     * Retrieve all cart items for the given cart id
     * @param {*} cartId 
     * @returns 
     */
    getCartItemsFromDB = async (cartId) => {
        // Retrieves cart items by joining cart items and product table.
        const cartItems = await pool.query('SELECT ci.cart_item_id, p.product_id, p.product_sku, p.product_name, p.price, p.stock, p.image_url, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id=p.product_id WHERE ci.cart_id=($1)', [cartId])
        let totalItems = 0
        for (let items of cartItems.rows) {
            totalItems += items.quantity
        }
        const formattedCartItems = []
        for (let cartItem of cartItems.rows) {
            formattedCartItems.push(transformFields(cartItem, DB_TO_API_MAPPING))
        }
        return { data: formattedCartItems, count: totalItems }
    }


    /**
     * Add cart item to users cart.
     * @param {*} cartId 
     * @param {*} productId 
     * @param {*} quantity 
     * @returns 
     */
    addCartItemToDB = async (cartId, productId, quantity) => {
        try {
            // attemps to add item to cart, if already present increment quantity instead.
            const cartItem = await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity RETURNING *'
                , [cartId, productId, quantity])
            if (cartItem.rowCount === 0) {
                throw new Error('Could not add cart item to db, try again later')
            }
            return transformFields(cartItem.rows[0], DB_TO_API_MAPPING)
        } catch (err) {
            if (err.code === '23503') {
                throw new NotFoundError('product does not exist')
            }
            throw err
        }
    }

    /**
     * Updates quantity of cart item
     * @param {*} quantity 
     * @param {*} cartItemId 
     * @param {*} cartId 
     * @returns 
     */
    updateCartItemQuantityInDB = async (quantity, cartItemId, cartId) => {
        const cartItem = await pool.query('UPDATE cart_items SET quantity = ($1) WHERE cart_item_id = ($2) AND cart_id = ($3) RETURNING *', [quantity, cartItemId, cartId])
        if (cartItem.rowCount === 0) {
            throw new NotFoundError('cart item passed in was not found')
        }
        return transformFields(cartItem.rows[0], DB_TO_API_MAPPING)
    }

    /**
     * Removes cart item for user
     * @param {*} cartItemId 
     * @param {*} cartId 
     * @returns 
     */
    removeCartItemFromDB = async (cartItemId, cartId) => {
        const cartItem = await pool.query('DELETE FROM cart_items WHERE cart_item_id = ($1) AND cart_id = ($2)', [cartItemId, cartId])
        if (cartItem.rowCount === 0) {
            throw new NotFoundError('cart item was not found')
        }
        return { msg: `Deleted cart item ${cartItemId} successfully` }
    }

    /**
     * Removes all cart items for user
     * @param {*} cartId 
     * @returns 
     */
    clearCartItemForUserInDB = async (cartId) => {
        const deletedCart = await pool.query('DELETE FROM cart_items WHERE cart_id = ($1)', [cartId])
        if (deletedCart.rowCount === 0) {
            throw new NotFoundError(`Could not find cart id ${cartId}`)
        }
        return { msg: 'Cart has been cleared' }
    }
}

module.exports = new CartModel();