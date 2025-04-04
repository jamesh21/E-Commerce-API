require("dotenv").config();

// library that wraps all async function in try catch block
require("express-async-errors");
const express = require('express')
const cors = require('cors')
const app = express()

// routers
const productRouter = require('./routes/product')
const authRouter = require('./routes/auth')
const cartItemRouter = require('./routes/cart-item')
const checkoutRouter = require('./routes/checkout')
const userRouter = require('./routes/user')

// middleware
const authMiddleware = require('./middleware/authentication')
const errorHandler = require('./middleware/error-handler')
const notFoundHandler = require('./middleware/not-found')
app.use(cors())
app.use(express.json());

// routing
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/user', authMiddleware, userRouter)
app.use('/api/v1/cart/item', authMiddleware, cartItemRouter)
app.use('/api/v1/checkout', checkoutRouter)

app.use(notFoundHandler)
app.use(errorHandler)


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Connected to port ${port}`)
})