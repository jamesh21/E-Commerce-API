const { getUserInfoFromDb } = require('../services/db')
const { StatusCodes } = require('http-status-codes')

const getUserInfo = async (req, res) => {
    const { userId } = req.user
    const result = await getUserInfoFromDb(userId)
    return res.status(StatusCodes.OK).json(result)
}

module.exports = { getUserInfo }