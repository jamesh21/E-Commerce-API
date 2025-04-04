const { StatusCodes } = require('http-status-codes')
const userService = require('../services/user-service');

/**
 * Registers a new user into users table. Returns bearer token and user data
 * @param {*} req 
 * @param {*} res 
 * @returns An object that holds a bearer token and user details
 */
const register = async (req, res) => {
    const { email, name, password } = req.body
    const userTokenInfo = await userService.register(email, name, password)

    return res.status(StatusCodes.CREATED).json(userTokenInfo)
}

/**
 * Logs in registered user by fetching bearer token and user data
 * @param {*} req 
 * @param {*} res 
 * @returns An object that holds a bearer token and user details
 */
const login = async (req, res) => {
    const { email, password } = req.body
    const userTokenInfo = await userService.login(email, password)

    return res.status(StatusCodes.OK).json(userTokenInfo)
}



module.exports = { login, register }