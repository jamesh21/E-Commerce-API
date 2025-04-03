const pool = require('../db'); // Import the database connection
const { ConflictError, NotFoundError } = require('../errors')
const { transformFields } = require('../utils/field-mapper')
const { DB_TO_API_MAPPING } = require('../constants/field-mappings')
const { DB_DUP_ENTRY } = require('../constants/error-messages')

class UserModel {

    /**
     * This function will create a new entry in users table.
     * @param {*} email 
     * @param {*} hashedPassword 
     * @param {*} name 
     * @returns 
     */
    addUserToDB = async (email, hashedPassword, name) => {
        try {
            const user = await pool.query('INSERT INTO users (email_address, password_hash, full_name, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
                [email, hashedPassword, name, false]
            )
            if (user.rows.length === 0) {
                throw new Error('User could not be created, try again later')
            }

            return transformFields(user.rows[0], DB_TO_API_MAPPING)
        } catch (err) {
            // duplicate entry
            if (err.code === DB_DUP_ENTRY) {
                throw new ConflictError('email already exists')
            }
            throw err
        }
    }

    /**
    * Retrieves user info from users table.
    * @param {*} userId 
    * @returns 
    */
    getUserInfoFromDb = async (email) => {
        const user = await pool.query('SELECT email_address, full_name, is_admin from users WHERE email_address = ($1)', [email])
        if (user.rowCount === 0) {
            throw new NotFoundError('User was not found')
        }

        return transformFields(user.rows[0], DB_TO_API_MAPPING)
    }


    /**
     * Retrieves specific users from users table, This will also return hashed password.
     * @param {*} email 
     * @returns 
     */
    getUserFromDB = async (email) => {
        const user = await pool.query('SELECT * FROM users WHERE email_address = ($1)', [email])
        if (user.rowCount === 0) {
            throw new NotFoundError('User was not found')
        }
        return transformFields(user.rows[0], DB_TO_API_MAPPING)
    }

    /**
     * Retrieves all users from users table.
     * @returns 
     */
    getUsersFromDB = async () => {
        const users = await pool.query('SELECT user_id, email_address, full_name, is_admin FROM users')
        const formattedUsers = []
        // format all user info
        for (let user of users.rows) {
            formattedUsers.push(transformFields(user, DB_TO_API_MAPPING))
        }

        return { data: formattedUsers, count: formattedUsers.length }
    }


    /**
     * Updates specific user role in users table.
     * @param {*} isNewRoleAdmin 
     * @param {*} userId 
     * @returns 
     */
    updateUserRoleInDB = async (isNewRoleAdmin, userId) => {

        const updatedUser = await pool.query('UPDATE users SET is_admin=($1) WHERE user_id = ($2) RETURNING *', [isNewRoleAdmin, userId])
        if (updatedUser.rowCount === 0) {
            throw new Error('Could not update user role, please try again later')
        }
        return transformFields(updatedUser.rows[0], DB_TO_API_MAPPING)
    }
}

module.exports = new UserModel();