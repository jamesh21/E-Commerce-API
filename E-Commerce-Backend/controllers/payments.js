const { updateOrderInDB, clearCartItemForUserInDB } = require('../services/db')
const stripeWebhook = async (req, res) => {
    const event = req.body; // No need to use stripe.webhooks.constructEvent()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object

        // Update order table with status paid
        await updateOrderInDB(session.metadata.orderId, { 'stripe_payment_intent_id': session.payment_intent, 'order_status': 'paid' })

        const result = await clearCartItemForUserInDB(session.metadata.cartId)

    }

    res.status(200).json({ received: true });
}

module.exports = { stripeWebhook }