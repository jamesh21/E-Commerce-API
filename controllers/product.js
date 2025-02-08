const pool = require('../db'); // Import the database connection
const { StatusCodes } = require('http-status-codes')

const getProduct = async (req, res) => {
    const { sku } = req.params
    const product = await pool.query('SELECT product_sku, product_name, price, quantity FROM products WHERE product_sku = ($1)',
        [sku])

    res.status(StatusCodes.OK).json({ data: product.rows, count: product.rows.length })
}

const getProducts = async (req, res) => {
    const allProducts = await pool.query('SELECT product_sku, product_name, price, quantity FROM products')
    res.status(StatusCodes.OK).json({ data: allProducts.rows, count: allProducts.rows.length })
}

const addProduct = async (req, res) => {
    const { productName, quantity, price, productSku } = req.body

    const newProduct = await pool.query('INSERT INTO products (product_name, quantity, price, product_sku) VALUES ($1, $2, $3, $4) RETURNING *',
        [productName, quantity, price, productSku])
    return res.status(StatusCodes.CREATED).json(newProduct.rows[0])

}

const updateProduct = async (req, res) => {
    const { sku } = req.params
    res.send('update product')
}

const deleteProduct = async (req, res) => {
    const { sku } = req.params
    const product = await pool.query('DELETE FROM products WHERE product_sku = ($1)', [sku])
    if (product.rowCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Product sku was not found' })
    }

    res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = { getProduct, addProduct, updateProduct, deleteProduct, getProducts }