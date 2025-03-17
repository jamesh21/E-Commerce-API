const { ForbiddenError } = require('../errors')

const admin = (req, res, next) => {

    const { isAdmin } = req.user
    if (!isAdmin) {
        throw new ForbiddenError('Access denied, only admins can access this route')
    }
    next()
}

module.exports = admin