require("dotenv").config();

// library that wraps all async function in try catch block
require("express-async-errors");
const express = require('express')
const app = express()
const productRouter = require('./routes/product')
const authRouter = require('./routes/auth')

// middleware
const authMiddleware = require('./middleware/authentication')
const errorHandler = require('./middleware/error-handler')
const notFoundHandler = require('./middleware/not-found')
app.use(express.json());

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', authMiddleware, productRouter)
app.use(notFoundHandler)
app.use(errorHandler)


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Connected to port ${port}`)
})