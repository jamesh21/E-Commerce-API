const { ForbiddenError } = require('../errors')

const admin = (req, res, next) => {
    const { admin } = req.user
    if (!admin) {
        throw new ForbiddenError('Access denied, only admins can access this route')
    }
    next()
}

module.exports = admin