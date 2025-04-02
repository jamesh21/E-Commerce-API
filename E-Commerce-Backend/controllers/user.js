const { getUserInfoFromDb, getUsersFromDB, updateUserRoleInDB } = require('../services/db')
const { StatusCodes } = require('http-status-codes')

/**
 * Retrieves user info from db
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUserInfo = async (req, res) => {
    const { email } = req.user

    const result = await getUserInfoFromDb(email)
    return res.status(StatusCodes.OK).json(result)
}

/**
 *  Retrieves all users from db
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUsers = async (req, res) => {
    const result = await getUsersFromDB()
    return res.status(StatusCodes.OK).json(result)
}

/**
 * Updates user role in db.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateUserRole = async (req, res) => {
    const { isAdmin, userId } = req.body
    const result = await updateUserRoleInDB(isAdmin, userId)
    return res.status(StatusCodes.OK).json(result)
}

module.exports = { getUserInfo, getUsers, updateUserRole }