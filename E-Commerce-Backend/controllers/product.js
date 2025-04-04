const { StatusCodes } = require('http-status-codes')
const productService = require('../services/product-service')

/**
 * Get Route for retrieving a single product from the sku provided in param.
 * @param {*} req 
 * @param {*} res 
 */
const getProduct = async (req, res) => {
    const { sku } = req.params
    const product = await productService.getProduct(sku)

    return res.status(StatusCodes.OK).json(product)
}

/**
 * Get Route for retrieving all products
 * @param {*} req 
 * @param {*} res 
 */
const getProducts = async (req, res) => {
    const products = await productService.getProducts()
    return res.status(StatusCodes.OK).json(products)
}

/**
 * Post Route for adding a new product to products table with the fields from req body
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const addProduct = async (req, res) => {
    const { productName, stock, price, productSku, imageUrl } = req.body
    const addedProduct = await productService.addProduct(productName, stock, price, productSku, imageUrl)

    return res.status(StatusCodes.CREATED).json(addedProduct)
}

/**
 * Put Route for updating an existing product in products table. Update can support partial updates. Fields to be updated will 
 * be sent from req body
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateProduct = async (req, res) => {
    const { id } = req.params
    const updates = req.body
    const updatedProduct = await productService.updateProduct(id, updates)

    return res.status(200).json(updatedProduct)
}

/**
 * Del Route for deleting a single product from products table given the sku from params.
 */
const deleteProduct = async (req, res) => {
    const { id } = req.params

    await productService.deleteProduct(id)

    return res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = { getProduct, addProduct, updateProduct, deleteProduct, getProducts }