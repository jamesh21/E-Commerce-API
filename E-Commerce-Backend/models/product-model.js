const pool = require('../db'); // Import the database connection
const { ConflictError, NotFoundError } = require('../errors')
const { transformFields } = require('../utils/field-mapper')
const { DB_TO_API_MAPPING, API_TO_DB_MAPPING } = require('../constants/field-mappings')
const { DB_DUP_ENTRY } = require('../constants/error-messages')

class ProductModel {

    /**
     * Retrieves product from db given product sku.
     * @param {*} sku 
     * @returns 
     */
    getProductFromDB = async (sku) => {
        const product = await pool.query('SELECT product_sku, product_name, price, stock FROM products WHERE product_sku = ($1)',
            [sku])
        if (product.rowCount === 0) {
            throw new NotFoundError('Product sku was not found')
        }
        const formattedProducts = []
        for (let item of product.rows) {
            formattedProducts.push(transformFields(item, DB_TO_API_MAPPING))
        }

        return { data: formattedProducts, count: product.length }
    }

    /**
     * Retreives all products from products table.
     * @returns 
     */
    getProductsFromDB = async () => {
        const allProducts = await pool.query('SELECT * FROM products')
        const formattedProducts = []
        for (let product of allProducts.rows) {
            formattedProducts.push(transformFields(product, DB_TO_API_MAPPING))
        }

        return { data: formattedProducts, count: formattedProducts.length }
    }

    /**
     * Adds new product to products table.
     * @param {*} productName 
     * @param {*} stock 
     * @param {*} price 
     * @param {*} productSku 
     * @param {*} imageUrl 
     * @returns 
     */
    addProductToDB = async (productName, stock, price, productSku, imageUrl) => {
        try {
            const newProduct = await pool.query('INSERT INTO products (product_name, stock, price, product_sku, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [productName, stock, price, productSku, imageUrl])
            if (newProduct.rowCount === 0) {
                throw new Error('Product could not be created, try again later')
            }
            return transformFields(newProduct.rows[0], DB_TO_API_MAPPING)
        } catch (err) {
            if (err.code === DB_DUP_ENTRY) {
                throw new ConflictError('Product Sku has to be unique')
            }
            throw err
        }
    }

    /**
     * Update product in products table
     * @param {*} sku 
     * @param {*} fieldsToUpdate 
     * @returns 
     */
    updateProductInDB = async (sku, fieldsToUpdate) => {
        const setStatements = [], values = []
        let i = 1
        // building array of fields to update, since it could be a partial update
        for (const [field, value] of Object.entries(fieldsToUpdate)) {
            setStatements.push(`${field} = $${i}`)
            values.push(value)
            i++
        }
        values.push(sku)
        const query = `UPDATE products SET ${setStatements.join(',')} WHERE product_id = $${i} RETURNING *`

        try {
            const updatedProduct = await pool.query(query, values)
            if (updatedProduct.rowCount === 0) {
                throw new Error(updatedProduct)
            }
            return transformFields(updatedProduct.rows[0], DB_TO_API_MAPPING)
        } catch (err) {
            // duplicate entry
            if (err.code === DB_DUP_ENTRY) {
                throw new ConflictError('Product Sku has to be unique')
            }
            throw err
        }
    }

    /**
     * Delete product from products table.
     * @param {*} productId 
     */
    deleteProductInDB = async (productId) => {
        const product = await pool.query('DELETE FROM products WHERE product_id = ($1)', [productId])
        if (product.rowCount === 0) {
            throw new NotFoundError('Product sku was not found')
        }
    }
}

module.exports = new ProductModel();