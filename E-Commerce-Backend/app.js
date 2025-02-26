require("dotenv").config();

// library that wraps all async function in try catch block
require("express-async-errors");
const express = require('express')
const app = express()
// routers
const productRouter = require('./routes/product')
const authRouter = require('./routes/auth')
const cartItemRouter = require('./routes/cart-item')
const checkoutRouter = require('./routes/checkout')
// middleware
const authMiddleware = require('./middleware/authentication')

const errorHandler = require('./middleware/error-handler')
const notFoundHandler = require('./middleware/not-found')
app.use(express.json());

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/cart/item', authMiddleware, cartItemRouter)
app.use('/api/v1/checkout', authMiddleware, checkoutRouter)
app.use(notFoundHandler)
app.use(errorHandler)


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Connected to port ${port}`)
})