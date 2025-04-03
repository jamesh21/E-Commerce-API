const cartModel = require('../models/cart-model')
const { BadRequestError } = require('../errors')

class CartService {
    getCart = (userId) => {
        return cartModel.getCartFromDB(userId)
    }

    addCart = (userId) => {
        return cartModel.addCartToDB(userId)
    }

    getCartItems = (cartId) => {
        return cartModel.getCartItemsFromDB(cartId)
    }

    addCartItem = (productId, quantity, cartId) => {
        if (!productId || !quantity) {
            throw new BadRequestError('product id or quantity is missing')
        }
        return cartModel.addCartItemToDB(cartId, productId, quantity)
    }

    updateCartItemQuantity = (quantity, cartItemId, cartId) => {
        if (quantity <= 0) {
            throw new BadRequestError('Quantity entered must be greater than 0')
        }
        return cartModel.updateCartItemQuantityInDB(quantity, cartItemId, cartId)
    }

    removeCartItem = (cartItemId, cartId) => {
        return cartModel.removeCartItemFromDB(cartItemId, cartId)
    }

    clearCart = (cartId) => {
        return cartModel.clearCartItemForUserInDB(cartId)
    }
}

module.exports = new CartService()