const { updateOrderInDB, clearCartItemForUserInDB, updateProductInDB, getProductsFromOrder } = require('../services/db')

/**
 * Stripe webhook is called after a successful payment has been made.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const stripeWebhook = async (req, res) => {
    // No need to use stripe.webhooks.constructEvent() since we will be using this locally.
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        // using order ID to retrieve items purchased and update product stock after this purchase is made.
        const { data: products } = await getProductsFromOrder(session.metadata.orderId)

        // loop through products and update product count in db
        for (let product of products) {
            await updateProductInDB(product.productId, { stock: product.stock - product.quantity })
        }

        // Update order table with status paid and stripe payment intent id
        await updateOrderInDB(session.metadata.orderId, { 'stripe_payment_intent_id': session.payment_intent, 'order_status': 'paid' })

        // Clear user cart after
        await clearCartItemForUserInDB(session.metadata.cartId)

    }

    return res.status(200).json({ received: true });
}

module.exports = { stripeWebhook }