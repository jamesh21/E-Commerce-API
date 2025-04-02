const BadRequestError = require('./bad-request')

class InsufficientStockError extends BadRequestError {
    constructor(items) {
        super("Not enough stock available for some items.", "INSUFFICIENT_STOCK");
        this.items = items; // Include details of out-of-stock items
    }
}

module.exports = InsufficientStockError