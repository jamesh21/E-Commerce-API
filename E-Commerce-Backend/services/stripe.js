const stripe = require('stripe')(process.env.STRIPE_SECRET);

const makePaymentWithStripe = async (cartItems, orderId) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cartItems.map(item => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.product_name },
                unit_amount: item.price * 100, // Convert to cents
            },
            quantity: item.quantity,
        })),
        mode: "payment",
        success_url: "https://yourfrontend.com/success",
        cancel_url: "https://yourfrontend.com/cancel",
        metadata: { orderId }, // Store order ID in metadata
    });

    return { url: session.url, stripeSessionId: session.id }
}

module.exports = { makePaymentWithStripe }