const { getProductFromDB, getProductsFromDB, addProductToDB, updateProductInDB, deleteProductInDB } = require('../services/db')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const { transformToDBFields } = require('../utils/field-mapper')
const { PRODUCT_FIELD_MAP } = require('../constants/field-mappings')

/**
 * Get Route for retrieving a single product from the sku provided in param.
 * @param {*} req 
 * @param {*} res 
 */
const getProduct = async (req, res) => {
    const { sku } = req.params

    const result = await getProductFromDB(sku)
    res.status(StatusCodes.OK).json(result)
}

/**
 * Get Route for retrieving all products
 * @param {*} req 
 * @param {*} res 
 */
const getProducts = async (req, res) => {
    const result = await getProductsFromDB()
    console.log('Product route called')
    res.status(StatusCodes.OK).json(result)
}

/**
 * Post Route for adding a new product to products table with the fields from req body
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const addProduct = async (req, res) => {
    const { productName, quantity, price, productSku, imageUrl } = req.body
    console.log(req.body)
    // Checks if required fields are filled in
    if (productName === '' || price === '' || productSku === '') {
        throw new BadRequestError('product name, price or product sku was left blank')
    }
    const newProduct = await addProductToDB(productName, quantity, price, productSku, imageUrl)
    return res.status(StatusCodes.CREATED).json(newProduct)
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
    const updates = transformToDBFields(req.body, PRODUCT_FIELD_MAP)
    if (Object.keys(updates).length === 0) {
        throw new BadRequestError('No update parameters were passed into request body')
    }
    const updatedProduct = await updateProductInDB(sku, updates)

    return res.status(200).json(updatedProduct)

}

/**
 * Del Route for deleting a single product from products table given the sku from params.
 */
const deleteProduct = async (req, res) => {
    const { sku } = req.params
    await deleteProductInDB(sku)

    res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = { getProduct, addProduct, updateProduct, deleteProduct, getProducts }