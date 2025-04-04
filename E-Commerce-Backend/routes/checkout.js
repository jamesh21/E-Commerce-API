const express = require('express')
const router = express.Router()
const { checkout, stripeCheckoutWebhook } = require('../controllers/checkout')
const authMiddleware = require('../middleware/authentication')

// This route is for stripe to call when successful payments are made.
router.route("/webhook").post(stripeCheckoutWebhook)

// Need auth for below routes
router.use(authMiddleware)
router.route('/').post(checkout)


module.exports = router