const express = require('express')
const { registerUser, 
        loginUser, 
        logoutUser, 
        forgotPassword, 
        resetPassword} = require('../controllers/authController')
const { getUserProfile, 
        changePassword, 
        updateProfile, 
        getAllUsers } = require('../controllers/authController')
const {isAuthenticatedUser, isAuthorizeRoles} = require('../middlewares/authenticate')
const { getUser } = require('../controllers/authController')
const { updateUser } = require('../controllers/authController')
const { deleteUser } = require('../controllers/authController')
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile)
router.route('/password/change').put(isAuthenticatedUser, changePassword)
router.route('/update').put(isAuthenticatedUser, updateProfile )

//Admin routes

router.route('/admin/users').get(isAuthenticatedUser, isAuthorizeRoles('admin'), getAllUsers )
router.route('/admin/user/:id').get(isAuthenticatedUser, isAuthorizeRoles('admin'), getUser )
                                .put(isAuthenticatedUser, isAuthorizeRoles('admin'), updateUser )
                                .delete(isAuthenticatedUser, isAuthorizeRoles('admin'), deleteUser )


module.exports = router