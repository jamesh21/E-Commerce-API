const express = require('express')
const router = express.Router()
const { getCart, createNewCart, clearCart } = require('../controllers/cart')

router.route('/').get(getCart).post(createNewCart).delete(clearCart)

module.exports = router