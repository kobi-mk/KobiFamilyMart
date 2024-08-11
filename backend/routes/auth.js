const express = require('express')
const { registerUser, loginUser } = require('../controllers/authController')
const { logoutUser } = require('../controllers/authController')
const { forgotPassword } = require('../controllers/authController')
const { resetPassword } = require('../controllers/authController')
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)

module.exports = router 