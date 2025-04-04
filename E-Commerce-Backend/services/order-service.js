const orderModel = require('../models/order-model')
const stripeService = require('./stripe-service')
const productService = require('./product-service')
const cartModel = require('../models/cart-model')
const { BadRequestError } = require('../errors')

class OrderService {

    checkout = async (cartId, userId) => {
        // create order in db
        const { orderId, cartItems } = await orderModel.createOrder(cartId, userId)

        // create stripe session
        const { stripeSessionId, url } = await stripeService.makePaymentWithStripe(cartItems, orderId, cartId)

        // update order in db with stripe session id
        await orderModel.updateOrderInDB(orderId, { 'stripe_session_Id': stripeSessionId })

        // return stripe payment url
        return url
    }

    stripeCheckoutWebhook = async (event) => {
        if (!event) {
            throw new BadRequestError('event was not passed in for stripe webhook to use')
        }
        // No need to use stripe.webhooks.constructEvent() since we will be using this locally.
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            // using order ID to retrieve items purchased and update product stock after this purchase is made.
            const { data: products } = await orderModel.getProductsFromOrder(session.metadata.orderId)

            // loop through products and update product count in db
            for (let product of products) {
                await productService.updateProduct(product.productId, { stock: product.stock - product.quantity })
            }

            // Update order table with status paid and stripe payment intent id
            await orderModel.updateOrderInDB(session.metadata.orderId, { 'stripe_payment_intent_id': session.payment_intent, 'order_status': 'paid' })

            // Clear user cart after
            await cartModel.clearCartItemForUserInDB(session.metadata.cartId)
        }
    }

}

module.exports = new OrderService()