const { getUserInfoFromDb, getUsersFromDB, updateUserRoleInDB } = require('../services/db')
const { StatusCodes } = require('http-status-codes')

const getUserInfo = async (req, res) => {
    const { userId } = req.user
    const result = await getUserInfoFromDb(userId)
    return res.status(StatusCodes.OK).json(result)
}
const getUsers = async (req, res) => {
    const result = await getUsersFromDB()
    return res.status(StatusCodes.OK).json(result)
}
const updateUserRole = async (req, res) => {
    const { isAdmin, userId } = req.body
    const result = await updateUserRoleInDB(isAdmin, userId)
    return res.status(StatusCodes.OK).json(result)
}
module.exports = { getUserInfo, getUsers, updateUserRole }