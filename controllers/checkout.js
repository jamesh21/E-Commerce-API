const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const { makePaymentWithStripe } = require('../services/stripe')
const { getCartItemsFromDB, createOrderInDB, addOrderLineItemToDB } = require('../services/db')

const checkout = async (req, res) => {
    const { cartId, userId } = req.user
    // Retrieve all items from user's cart
    const { data: cartItems } = await getCartItemsFromDB(cartId)
    // Need to check inventory
    // Get total cost of items
    let total = 0
    for (let cartItem of cartItems) {
        cartItem['total'] = cartItem.price * cartItem.quantity
        total += cartItem['total']
    }
    console.log(cartItems)
    // Create an order, in DB
    const orderId = await createOrderInDB(userId, total)
    // console.log(`this is the order id ${orderId}`)
    // Add order line items
    for (let cartItem of cartItems) {
        await addOrderLineItemToDB(cartItem, orderId)
    }
    // create stripe payment
    const url = await makePaymentWithStripe(cartItems)

    // may need to insert stripe payment into a new table called payments
    res.status(StatusCodes.OK).json({ url })
}

module.exports = { checkout }