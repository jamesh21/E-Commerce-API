const pool = require('../db'); // Import the database connection
const { ConflictError, NotFoundError } = require('../errors')
const { transformFields } = require('../utils/field-mapper')
const { DB_TO_API_MAPPING, API_TO_DB_MAPPING } = require('../constants/field-mappings')

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

}

module.exports = new CartModel();