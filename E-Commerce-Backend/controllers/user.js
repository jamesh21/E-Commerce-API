const { StatusCodes } = require('http-status-codes')
const userService = require('../services/user-service')

/**
 * Retrieves user info
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUserInfo = async (req, res) => {
    const { email } = req.user

    const userInfo = await userService.getUserInfo(email)

    return res.status(StatusCodes.OK).json(userInfo)
}

/**
 *  Retrieves all users
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUsers = async (req, res) => {
    const users = await userService.getUsers()

    return res.status(StatusCodes.OK).json(users)
}

/**
 * Updates user role.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateUserRole = async (req, res) => {
    const { isAdmin, userId } = req.body
    const updatedUser = await userService.updateUserRole(isAdmin, userId)
    return res.status(StatusCodes.OK).json(updatedUser)
}

module.exports = { getUserInfo, getUsers, updateUserRole }