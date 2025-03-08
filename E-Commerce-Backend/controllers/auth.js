const { addUserToDB, getUserFromDB, addCartToDB, getCartFromDB } = require('../services/db')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const { transformToAPIFields } = require('../utils/field-mapper')
const { USER_FIELD_MAP } = require('../constants/field-mappings')

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
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hashedPassword = await bcrypt.hash(password, salt)

    // add fields to db
    const user = await addUserToDB(email, hashedPassword, name)
    const userData = transformToAPIFields(user, USER_FIELD_MAP)
    const cartId = await getOrCreateCart(userData.userId)
    // create bearer token and return
    const token = createJWT(userData.email, userData.name, false, userData.userId, cartId)
    return res.status(StatusCodes.CREATED).json(
        {
            user:
            {
                name: userData.name,
                email: userData.email,
                userId: userData.userId
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

    // convert returned user fields to api format
    const userData = transformToAPIFields(user, USER_FIELD_MAP)
    // compare if password matches
    const passwordMatch = await comparePassword(password, userData.password)
    if (!passwordMatch) {
        throw new UnauthenticatedError('Incorrect Password')
    }
    const cartId = await getOrCreateCart(userData.userId)
    const token = createJWT(userData.email, userData.name, userData.admin, userData.userId, cartId)
    return res.status(StatusCodes.OK).json(
        {
            user:
            {
                name: userData.name,
                email: userData.email,
                userId: userData.userId,
                admin: userData.admin
            },
            token
        })
}

/**
 * Helper function for creating a new token given user information.
 * @param {*} email 
 * @param {*} name 
 * @param {*} admin 
 * @param {*} id 
 * @returns 
 */
const createJWT = (email, name, admin, id, cartId) => {
    const token = jwt.sign(
        {
            email, name, admin, id, cartId
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
        return cart.cart_id
    }
    const newCart = await addCartToDB(userId)
    return newCart.cart_id
}

module.exports = { login, register }