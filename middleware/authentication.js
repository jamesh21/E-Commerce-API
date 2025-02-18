const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

/**
 * Middleware for checking if bearer token is valid for accessing resources.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError('Missing Authorization header or bearer token')
    }
    // get token value
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payload.userId, name: payload.name };
    } catch (err) {
        throw new UnauthenticatedError("Authentication invalid");
    }
    next()
}

module.exports = auth

