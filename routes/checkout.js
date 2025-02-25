const express = require('express')
const router = express.Router()
const { checkout } = require('../controllers/checkout')

router.route('/').post(checkout)

module.exports = router