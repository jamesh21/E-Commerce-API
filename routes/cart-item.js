const express = require('express')
const router = express.Router()
const { addCartItem, removeCartItem, getCartItems, updateCartItemQuantity } = require('../controllers/cart-item')

router.route('/').get(getCartItems).post(addCartItem)
router.route('/:itemId').delete(removeCartItem).patch(updateCartItemQuantity)

module.exports = router