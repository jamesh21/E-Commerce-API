const cartModel = require('../models/cart-model')


class CartService {
    getCart = (userId) => {
        return cartModel.getCartFromDB(userId)
    }

    addCart = (userId) => {
        return cartModel.addCartToDB(userId)
    }
}

module.exports = new CartService()