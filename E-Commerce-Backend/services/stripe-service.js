
class StripeService {
    stripe = require('stripe')(process.env.STRIPE_SECRET);
    /**
     * This function contacts stripe api wiht our order details and will return a url to stripes payment page.
     * @param {*} cartItems 
     * @param {*} orderId 
     * @param {*} cartId 
     * @returns 
     */
    makePaymentWithStripe = async (cartItems, orderId, cartId) => {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: cartItems.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.productName },
                    unit_amount: item.price * 100, // Convert to cents
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.STRIPE_SUCCESS_URL}?orderId=${orderId}`, // URL to reroute too after successful payment.
            cancel_url: `${process.env.STRIPE_CANCEL_URL}`, // URL if payment is cancellded ex. hitting back button on stripe page.
            metadata: { orderId, cartId }, // Store order ID in metadata
        });

        return { url: session.url, stripeSessionId: session.id }
    }

}


module.exports = new StripeService()