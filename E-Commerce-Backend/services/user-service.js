const userModel = require('../models/user-model')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const cartService = require('./cart-service')
const { DB_DUP_ENTRY } = require('../constants/error-messages')

class UserService {

    getUserInfo = async (email) => {
        return userModel.getUserInfoFromDb(email)
    }

    getUsers = async () => {
        return userModel.getUsersFromDB()
    }

    updateUserRole = async (isAdmin, userId) => {
        return userModel.updateUserRoleInDB(isAdmin, userId)
    }

    register = async (email, name, password) => {
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
        const user = await userModel.addUserToDB(email, hashedPassword, name)

        // Creates designated cart for new user
        const cartId = await this.getOrCreateCart(user.userId) // Need to check this method

        return this.buildAuthResponse(user, cartId)
    }




    login = async (email, password) => {
        if (!email || !password) {
            throw new BadRequestError('Email and password must be provided')
        }
        // Retrieve user details based on email
        const user = await userModel.getUserFromDB(email)

        // compare if password matches
        const passwordMatch = await this.comparePassword(password, user.password)
        if (!passwordMatch) {
            throw new UnauthenticatedError('Incorrect Password')
        }

        const cartId = await this.getOrCreateCart(user.userId)

        return this.buildAuthResponse(user, cartId)
    }




    /**
     * Helper function for building auth response.
     * @param {*} user 
     * @param {*} cartId 
     * @returns An object that holds a bearer token and user details
     */
    buildAuthResponse = (user, cartId) => {
        const token = this.createJWT(user.email, user.name, user.userId, cartId)
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
    createJWT = (email, name, id, cartId) => {
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
    comparePassword = async (candidatePassword, dbPass) => {
        const isMatch = await bcrypt.compare(candidatePassword, dbPass);
        return isMatch;
    }

    /**
     * Helper function for checking if user has cart, if not it creates a new cart
     * @param {*} userId 
     * @returns cart id of the user
     */
    getOrCreateCart = async (userId) => {
        const cart = await cartService.getCart(userId)

        if (cart) {
            return cart.cartId
        }
        const newCart = await cartService.addCart(userId)
        return newCart.cartId
    }
}

module.exports = new UserService()