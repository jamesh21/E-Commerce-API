const pool = require('../db'); // Import the database connection
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes')
const { ConflictError, BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors')
const { transformToAPIFields } = require('../utils/field-mapper')
const { USER_FIELD_MAP } = require('../constants/field-mappings')

/**
 * Registers a new user into users table. Returns bearer token and user data
 * @param {*} req 
 * @param {*} res 
 */
const register = async (req, res) => {
    const { email, name, admin, password } = req.body
    if (!email || !name || !password || admin == null) {
        throw new BadRequestError('Email, name, admin or password was not provided')
    }
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hashedPassword = await bcrypt.hash(password, salt)
    try {
        // add fields to db
        const user = await pool.query('INSERT INTO users (email_address, password_hash, full_name, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, hashedPassword, name, admin]
        )
        const userData = transformToAPIFields(user.rows[0], USER_FIELD_MAP)
        // create bearer token and return
        const token = createJWT(userData.email, userData.name, userData.admin, userData.userId)
        return res.status(StatusCodes.CREATED).json(
            {
                user:
                {
                    name: userData.name,
                    email: userData.email,
                    userId: userData.userId,
                    admin: userData.admin
                },
                token
            })
    } catch (err) {
        // duplicate entry
        if (err.code === '23505') {
            throw new ConflictError('email already exists')
        }
        throw err
    }

}

/**
 * Logs in registered user by fetching bearer token and user data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Email and password must be provided')
    }
    const user = await pool.query('SELECT * FROM users WHERE email_address = ($1)', [email])
    if (user.rowCount === 0) {
        throw new NotFoundError('User was not found')
    }
    // convert returned user fields to api format
    const userData = transformToAPIFields(user.rows[0], USER_FIELD_MAP)
    // compare if password matches
    const passwordMatch = await comparePassword(password, userData.password)
    if (!passwordMatch) {
        throw new UnauthenticatedError('Incorrect Password')
    }
    const token = createJWT(userData.email, userData.name, userData.admin, userData.userId)
    return res.status(StatusCodes.OK).json(
        {
            user:
            {
                name: userData.name,
                email: userData.email,
                userId: userData.userId,
                admin: userData.admin
            },
            token
        })
}

/**
 * Helper function for creating a new token given user information.
 * @param {*} email 
 * @param {*} name 
 * @param {*} admin 
 * @param {*} id 
 * @returns 
 */
const createJWT = (email, name, admin, id) => {
    const token = jwt.sign(
        {
            email, name, admin, id
        }, process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        })
    return token
}

/**
 * Compares candidate password with hashed password and returns a boolean representing if it has matched. 
 * @param {*} candidatePassword 
 * @param {*} dbPass 
 * @returns 
 */
const comparePassword = async (candidatePassword, dbPass) => {
    const isMatch = await bcrypt.compare(candidatePassword, dbPass);
    return isMatch;
}


module.exports = { login, register }