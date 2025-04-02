const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const { getUserInfoFromDb } = require('../services/db')

/**
 * Middleware for checking if bearer token is valid for accessing resources.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError('Missing Authorization header or bearer token')
    }
    // get token value
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        // We want to check with our backened to see what the user's role is
        const result = await getUserInfoFromDb(payload.email)

        // Set user info in req header
        req.user = { userId: payload.id, name: payload.name, cartId: payload.cartId, isAdmin: result.isAdmin, email: payload.email };
    } catch (err) {
        throw new UnauthenticatedError("Authentication invalid");
    }
    next()
}

module.exports = auth

