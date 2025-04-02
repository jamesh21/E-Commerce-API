const { ForbiddenError } = require('../errors')

/**
 * Middleware for checking if user role is admin, before allowing them to proceed.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const admin = (req, res, next) => {

    const { isAdmin } = req.user
    if (!isAdmin) {
        throw new ForbiddenError('Access denied, only admins can access this route')
    }
    next()
}

module.exports = admin