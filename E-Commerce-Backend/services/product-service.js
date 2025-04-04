const productModel = require('../models/product-model')
const { BadRequestError } = require('../errors')
const { API_TO_DB_MAPPING } = require('../constants/field-mappings')
const { transformFields } = require('../utils/field-mapper')

class ProductService {
    getProduct = (id) => {
        return productModel.getProductFromDB(id)
    }

    getProducts = () => {
        return productModel.getProductsFromDB()
    }

    addProduct = (productName, stock, price, productSku, imageUrl) => {
        // Checks if required fields are filled in
        if (productName === '' || price === '' || productSku === '') {
            throw new BadRequestError('product name, price or product sku was left blank')
        }
        return productModel.addProductToDB(productName, stock, price, productSku, imageUrl)
    }

    updateProduct = (productId, updates) => {
        if (Object.keys(updates).length === 0) {
            throw new BadRequestError('No update parameters were passed into request body')
        }
        // format values to db criteria
        const formattedUpdates = transformFields(updates, API_TO_DB_MAPPING)
        return productModel.updateProductInDB(productId, formattedUpdates)
    }

    deleteProduct = (productId) => {
        return productModel.deleteProductInDB(productId)

    }
}

module.exports = new ProductService()