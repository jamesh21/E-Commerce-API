const { StatusCodes } = require('http-status-codes')
const orderService = require('../services/order-service')


const checkout = async (req, res) => {
    const { cartId, userId } = req.user

    const url = await orderService.checkout(cartId, userId)

    // may need to insert stripe payment into a new table called payments
    res.status(StatusCodes.OK).json({ url })
}

const stripeCheckoutWebhook = async (req, res) => {

    const event = req.body;

    await orderService.stripeCheckoutWebhook(event)

    return res.status(200).json({ received: true });
}

module.exports = { checkout, stripeCheckoutWebhook }