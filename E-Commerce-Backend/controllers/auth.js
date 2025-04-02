const { addUserToDB, getUserFromDB, addCartToDB, getCartFromDB } = require('../services/db')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

/**
 * Registers a new user into users table. Returns bearer token and user data
 * @param {*} req 
 * @param {*} res 
 * @returns An object that holds a bearer token and user details
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

    // Creates designated cart for new user
    const cartId = await getOrCreateCart(user.userId)

    return res.status(StatusCodes.CREATED).json(buildAuthResponse(user, cartId))
}

/**
 * Logs in registered user by fetching bearer token and user data
 * @param {*} req 
 * @param {*} res 
 * @returns An object that holds a bearer token and user details
 */
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Email and password must be provided')
    }
    // Retrieve user details based on email
    const user = await getUserFromDB(email)

    // compare if password matches
    const passwordMatch = await comparePassword(password, user.password)
    if (!passwordMatch) {
        throw new UnauthenticatedError('Incorrect Password')
    }

    const cartId = await getOrCreateCart(user.userId)

    return res.status(StatusCodes.OK).json(buildAuthResponse(user, cartId))
}

/**
 * Helper function for building auth response.
 * @param {*} user 
 * @param {*} cartId 
 * @returns An object that holds a bearer token and user details
 */
const buildAuthResponse = (user, cartId) => {
    const token = createJWT(user.email, user.name, user.userId, cartId)
    return {
        user:
        {
            name: user.name,
            email: user.email,
            userId: user.userId,
            isAdmin: user.isAdmin
        },
        token
    }
}

/**
 * Helper function for creating a new token given user information.
 * @param {*} email 
 * @param {*} name 
 * @param {*} id 
 * @returns JWT bearer token
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
 * @returns Boolean representing if password is correct
 */
const comparePassword = async (candidatePassword, dbPass) => {
    const isMatch = await bcrypt.compare(candidatePassword, dbPass);
    return isMatch;
}

/**
 * Helper function for checking if user has cart, if not it creates a new cart
 * @param {*} userId 
 * @returns cart id of the user
 */
const getOrCreateCart = async (userId) => {
    const cart = await getCartFromDB(userId)

    if (cart) {
        return cart.cartId
    }
    const newCart = await addCartToDB(userId)
    return newCart.cartId
}

module.exports = { login, register }