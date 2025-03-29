const { updateOrderInDB, clearCartItemForUserInDB, updateProductInDB, getProductsFromOrder } = require('../services/db')

const stripeWebhook = async (req, res) => {
    const event = req.body; // No need to use stripe.webhooks.constructEvent()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        // using order ID to retrieve items purchased and update product quantity
        const { data: products } = await getProductsFromOrder(session.metadata.orderId)
        // loop through products and update product count in db
        for (let product of products) {
            await updateProductInDB(product.productId, { stock: product.stock - product.quantity })
        }

        // Update order table with status paid
        await updateOrderInDB(session.metadata.orderId, { 'stripe_payment_intent_id': session.payment_intent, 'order_status': 'paid' })

        const result = await clearCartItemForUserInDB(session.metadata.cartId)

    }

    res.status(200).json({ received: true });
}

module.exports = { stripeWebhook }