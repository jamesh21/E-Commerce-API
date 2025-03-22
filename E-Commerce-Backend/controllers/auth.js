const { addUserToDB, getUserFromDB, addCartToDB, getCartFromDB } = require('../services/db')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

/**
 * Registers a new user into users table. Returns bearer token and user data
 * @param {*} req 
 * @param {*} res 
 */
const register = async (req, res) => {
    const { email, name, password } = req.body
    if (!email || !name || !password == null) {
        throw new BadRequestError('Email, name or password was not provided')
    }
    if (password.length < 8) {
        throw new BadRequestError('Password must be atleast 8 characters long')
    }
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hashedPassword = await bcrypt.hash(password, salt)

    // add fields to db
    const user = await addUserToDB(email, hashedPassword, name)

    const cartId = await getOrCreateCart(user.userId)
    // create bearer token and return
    const token = createJWT(user.email, user.name, user.userId, cartId)
    return res.status(StatusCodes.CREATED).json(
        {
            user:
            {
                name: user.name,
                email: user.email,
                userId: user.userId,
                isAdmin: user.isAdmin
            },
            token
        })
}

/**
 * Logs in registered user by fetching bearer token and user data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Email and password must be provided')
    }
    const user = await getUserFromDB(email)

    // compare if password matches
    const passwordMatch = await comparePassword(password, user.password)
    if (!passwordMatch) {
        throw new UnauthenticatedError('Incorrect Password')
    }

    const cartId = await getOrCreateCart(user.userId)
    const token = createJWT(user.email, user.name, user.userId, cartId)

    return res.status(StatusCodes.OK).json(
        {
            user:
            {
                name: user.name,
                email: user.email,
                userId: user.userId,
                isAdmin: user.isAdmin
            },
            token
        })
}

/**
 * Helper function for creating a new token given user information.
 * @param {*} email 
 * @param {*} name 
 * @param {*} id 
 * @returns 
 */
const createJWT = (email, name, id, cartId) => {
    const token = jwt.sign(
        {
            email, name, id, cartId
        }, process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        })
    return token
}

/**
 * Compares candidate password with hashed password and returns a boolean representing if it has matched. 
 * @param {*} candidatePassword 
 * @param {*} dbPass 
 * @returns 
 */
const comparePassword = async (candidatePassword, dbPass) => {
    const isMatch = await bcrypt.compare(candidatePassword, dbPass);
    return isMatch;
}

const getOrCreateCart = async (userId) => {
    const cart = await getCartFromDB(userId)

    if (cart) {
        return cart.cartId
    }
    const newCart = await addCartToDB(userId)
    return newCart.cartId
}

module.exports = { login, register }