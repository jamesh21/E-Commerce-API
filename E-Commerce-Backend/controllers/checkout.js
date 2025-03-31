const { StatusCodes } = require('http-status-codes')
const { makePaymentWithStripe } = require('../services/stripe')
const { createOrder, updateOrderInDB } = require('../services/db')

const checkout = async (req, res) => {
    const { cartId, userId } = req.user

    // create order in db
    const { orderId, cartItems } = await createOrder(cartId, userId)

    // create stripe session
    const { stripeSessionId, url } = await makePaymentWithStripe(cartItems, orderId, cartId)

    // update order in db with stripe session id
    await updateOrderInDB(orderId, { 'stripe_session_Id': stripeSessionId })

    // may need to insert stripe payment into a new table called payments
    res.status(StatusCodes.OK).json({ url })
}

module.exports = { checkout }