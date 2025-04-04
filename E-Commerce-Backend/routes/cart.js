const express = require('express')
const router = express.Router()
const { addCartItem, removeCartItem, getCartItems, updateCartItemQuantity, clearCart } = require('../controllers/cart')

router.route('/').get(getCartItems).post(addCartItem).delete(clearCart)
router.route('/:cartItemId').delete(removeCartItem).patch(updateCartItemQuantity)

module.exports = router