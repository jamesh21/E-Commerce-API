const pool = require('../db'); // Import the database connection
const { ConflictError, NotFoundError, InsufficientStockError } = require('../errors')
const { transformFields } = require('../utils/field-mapper')
const { DB_TO_API_MAPPING, API_TO_DB_MAPPING } = require('../constants/field-mappings')

class OrderModel {

}

module.exports = new OrderModel();