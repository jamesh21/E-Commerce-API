const pool = require('../db'); // Import the database connection
const { ConflictError, InsufficientStockError } = require('../errors')
const { transformFields } = require('../utils/field-mapper')
const { DB_TO_API_MAPPING, API_TO_DB_MAPPING } = require('../constants/field-mappings')
const { DB_DUP_ENTRY } = require('../constants/error-messages')
const cartModel = require('./cart-model')

class OrderModel {

    /**
     * Creates order entry in orders table.
     * @param {*} userId 
     * @param {*} totalPrice 
     * @returns 
     */
    createOrderInDB = async (userId, totalPrice) => {
        const order = await pool.query('INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *', [userId, totalPrice])
        if (order.rowCount === 0) {
            throw new Error('Order could not be created, try again later')
        }
        return order.rows[0].order_id
    }

    /**
     * Creates entry in order items table.
     * @param {*} item 
     * @param {*} orderId 
     */
    addOrderLineItemToDB = async (item, orderId) => {
        await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', [orderId, item.productId, item.quantity, item.price])
    }

    /**
     * This function is responsible for the order creation flow.
     * @param {*} cartId 
     * @param {*} userId 
     * @returns 
     */
    createOrder = async (cartId, userId) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN')
            // Retrieve all items from user's cart
            const { data: cartItems } = await cartModel.getCartItemsFromDB(cartId)
            const insufficientStockItems = []

            // Get total cost of items
            let total = 0
            for (let cartItem of cartItems) {
                // Need to check if product inventory is enough to fufill
                if (cartItem.quantity > cartItem.stock) {
                    insufficientStockItems.push(cartItem.productName)
                }

                cartItem['total'] = cartItem.price * cartItem.quantity
                total += cartItem['total']
            }

            // If any item doesn't have enough stock, throw error and pass in all items that can't be fullfilled.
            if (insufficientStockItems.length > 0) {
                throw new InsufficientStockError(insufficientStockItems)
            }

            // Create an order, in DB
            const orderId = await this.createOrderInDB(userId, total)

            // Add order line items and reduce inventory in product table
            for (let cartItem of cartItems) {
                await this.addOrderLineItemToDB(cartItem, orderId)
            }
            await client.query('COMMIT')

            return { orderId, cartItems }

        } catch (err) {
            await client.query('ROLLBACK')
            throw err
        } finally {
            client.release()
        }
    }

    /**
     * Retrieves all products in order.
     * @param {*} orderId 
     * @returns 
     */
    getProductsFromOrder = async (orderId) => {
        const products = await pool.query('SELECT p.product_id, p.product_name, p.stock, oi.quantity FROM order_items oi JOIN products p ON p.product_id = oi.product_id WHERE oi.order_id=($1)', [orderId])
        if (products.rowCount === 0) {
            throw new Error('Order could not be created, try again later')
        }
        const formattedProducts = []
        for (let product of products.rows) {
            formattedProducts.push(transformFields(product, DB_TO_API_MAPPING))
        }

        return { data: formattedProducts, count: formattedProducts.length }
    }

    /**
     * Update fields in order table.
     * @param {*} orderId 
     * @param {*} fieldsToUpdate 
     * @returns 
     */
    updateOrderInDB = async (orderId, fieldsToUpdate) => {
        const setStatements = [], values = []
        let i = 1
        // building array of fields to update, since it could be a partial update
        for (const [field, value] of Object.entries(fieldsToUpdate)) {
            setStatements.push(`${field} = $${i}`)
            values.push(value)
            i++
        }
        values.push(orderId)
        const query = `UPDATE orders SET ${setStatements.join(',')} WHERE order_id = $${i} RETURNING *`
        try {
            const updatedOrder = await pool.query(query, values)
            if (updatedOrder.rowCount === 0) {
                throw new Error('Could not updated order, try again later')
            }
            return transformFields(updatedOrder.rows[0], API_TO_DB_MAPPING)
        } catch (err) {
            // duplicate entry
            if (err.code === DB_DUP_ENTRY) {
                throw new ConflictError('Product Sku has to be unique')
            }
            throw err
        }
    }

}

module.exports = new OrderModel();