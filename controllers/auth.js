const pool = require('../db'); // Import the database connection
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes')
const { ConflictError, BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors')
const { transformToAPIFields } = require('../utils/field-mapper')

const register = async (req, res) => {
    const { email, name, admin, password } = req.body
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hashedPassword = await bcrypt.hash(password, salt)
    // add fields to db
    const user = await pool.query('INSERT INTO users (email_address, password_hash, full_name, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, hashedPassword, name, admin]
    )
    // create bearer token and return
    const token = createJWT(email, name, admin, user.rows[0]['user_id'])
    res.status(StatusCodes.CREATED).json({ token })
}

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
    const userData = transformToAPIFields(user.rows[0], userFieldMapping)
    // compare if password matches
    const passwordMatch = await comparePassword(password, userData.password)
    if (!passwordMatch) {
        throw new UnauthenticatedError('Incorrect Password')
    }
    const token = createJWT(userData.email, userData.name, userData.admin, userData.userId)
    return res.status(StatusCodes.OK).json({ token })
}

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

const comparePassword = async (candidatePassword, dbPass) => {
    const isMatch = await bcrypt.compare(candidatePassword, dbPass);
    return isMatch;
}

const userFieldMapping = {
    userId: 'user_id',
    email: 'email_address',
    name: 'full_name',
    admin: 'is_admin',
    password: 'password_hash'
}
module.exports = { login, register }