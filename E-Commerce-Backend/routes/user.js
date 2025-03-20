const express = require('express')
const router = express.Router()
const adminMiddleware = require('../middleware/admin')
const { getUserInfo, getUsers, updateUserRole } = require('../controllers/user')

router.route('/').get(getUserInfo)

router.use(adminMiddleware)
router.route('/all').get(getUsers)
router.route('/role').put(updateUserRole)
module.exports = router