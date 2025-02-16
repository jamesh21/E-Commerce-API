const pool = require('../db'); // Import the database connection
const { StatusCodes } = require('http-status-codes')
const { ConflictError, BadRequestError, NotFoundError } = require('../errors')

/**
 * Get Route for retrieving a single product from the sku provided in param.
 * @param {*} req 
 * @param {*} res 
 */
const getProduct = async (req, res) => {
    const { sku } = req.params

    const product = await pool.query('SELECT product_sku, product_name, price, quantity FROM products WHERE product_sku = ($1)',
        [sku])
    if (product.rowCount === 0) {
        throw new NotFoundError('Product sku was not found')
    }
    res.status(StatusCodes.OK).json({ data: product.rows, count: product.rows.length })
}

/**
 * Get Route for retrieving all products
 * @param {*} req 
 * @param {*} res 
 */
const getProducts = async (req, res) => {
    const allProducts = await pool.query('SELECT product_sku, product_name, price, quantity FROM products')

    res.status(StatusCodes.OK).json({ data: allProducts.rows, count: allProducts.rows.length })
}

/**
 * Post Route for adding a new product to products table with the fields from req body
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const addProduct = async (req, res) => {
    const { productName, quantity, price, productSku } = req.body
    // Checks if required fields are filled in
    if (productName === '' || price === '' || productSku === '') {
        throw new BadRequestError('product name, price or product sku was left blank')
    }
    try {
        const newProduct = await pool.query('INSERT INTO products (product_name, quantity, price, product_sku) VALUES ($1, $2, $3, $4) RETURNING *',
            [productName, quantity, price, productSku])
        return res.status(StatusCodes.CREATED).json(newProduct.rows[0])
    } catch (err) {
        if (err.code === '23505') {
            throw new ConflictError('Product Sku has to be unique')
        }
        throw err
    }
}

/**
 * Put Route for updating an existing product in products table. Update can support partial updates. Fields to be updated will 
 * be sent from req body
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateProduct = async (req, res) => {
    const { sku } = req.params
    const updates = mapProductFields(req.body)
    if (Object.keys(updates).length === 0) {
        throw new BadRequestError('No update parameters were passed into request body')
    }
    const setStatements = [], values = []
    let i = 1
    // building array of fields to update, since it could be a partial update
    for (const [field, value] of Object.entries(updates)) {
        setStatements.push(`${field} = $${i}`)
        values.push(value)
        i++
    }
    values.push(sku)
    const query = `UPDATE products SET ${setStatements.join(',')} WHERE product_sku = $${i} RETURNING *`
    try {
        const updatedProduct = await pool.query(query, values)

        return res.status(200).json(updatedProduct.rows[0])
    } catch (err) {
        // duplicate entry
        if (err.code === '23505') {
            throw new ConflictError('Product Sku has to be unique')
        }
        throw err
    }
}

const productFieldMapping = {
    productName: 'product_name',
    imageURL: 'image_url',
    productSku: 'product_sku'
}

const mapProductFields = (apiData) => {
    const mappedData = {}
    for (const [apiField, value] of Object.entries(apiData)) {
        if (apiField in productFieldMapping) {
            mappedData[productFieldMapping[apiField]] = value
        } else {
            mappedData[apiField] = value
        }
    }
    return mappedData
}

/**
 * Del Route for deleting a single product from products table given the sku from params.
 */
const deleteProduct = async (req, res) => {
    const { sku } = req.params
    const product = await pool.query('DELETE FROM products WHERE product_sku = ($1)', [sku])
    if (product.rowCount === 0) {
        throw new NotFoundError('Product sku was not found')
    }

    res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = { getProduct, addProduct, updateProduct, deleteProduct, getProducts }