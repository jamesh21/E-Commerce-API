const { StatusCodes } = require('http-status-codes')
const { makePaymentWithStripe } = require('../services/stripe')
const { createOrder } = require('../services/db')

const checkout = async (req, res) => {
    const { cartId, userId } = req.user

    const cartItems = await createOrder(cartId, userId)
    // create stripe payment
    const url = await makePaymentWithStripe(cartItems)

    // may need to insert stripe payment into a new table called payments
    res.status(StatusCodes.OK).json({ url })
}

module.exports = { checkout }