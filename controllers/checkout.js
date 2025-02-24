const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const { makePaymentWithStripe } = require('../services/stripe')
const { getCartItemsFromDB, createOrderInDB } = require('../services/db')

const checkout = async (req, res) => {
    const { cartId, userId } = req.user
    // Retrieve all items from user's cart
    const { data: cartItems } = await getCartItemsFromDB(cartId)

    // Get total cost of items
    let total = 0
    for (let cartItem of cartItems) {
        cartItem['total'] = cartItem.price * cartItem.quantity
        total += cartItem['total']
    }
    // Create an order, in DB
    // const orderId = await createOrderInDB(userId, total)
    // console.log(`this is the order id ${orderId}`)
    // create stripe payment
    const url = await makePaymentWithStripe(cartItems)

    // may need to insert stripe payment into a new table called payments
    res.status(StatusCodes.OK).json({ url })
}

module.exports = { checkout }