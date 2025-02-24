const stripe = require('stripe')(process.env.STRIPE_SECRET);

const makePaymentWithStripe = async (cartItems) => {
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
    });
    // console.log(session)
    return session.url
}

module.exports = { makePaymentWithStripe }