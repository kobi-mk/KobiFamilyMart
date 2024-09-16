const catchAsyncError = require('../middlewares/catchAsyncError')
const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwt')
const sendEmail = require('../utils/email')
const crypto = require('crypto')

//Register -- /register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body

    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.file){
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
    } 

    const data = await User.create({
        name,
        email,
        password,
        avatar
    })
    sendToken(data, 201, res)
})

//Login -- /login
exports.loginUser = catchAsyncError(async (req, res, next)=> {
    const {email, password} = req.body

    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password', 400))
    }
    
    //finding the user database
    const data = await User.findOne({email}).select('+password')
    //Email checking
    if(!data){
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    //Password checking
    if(!await data.isValidPassword(password)){
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    
    sendToken(data, 201, res)
})

//Logout -- /logout
exports.logoutUser = (req, res, next)=> {
    res.cookie('token', null, {
       expires: new Date(Date.now()),
       httpOnly: true
    })
    .status(200)
    .json({
       success: true,
       message: "logged-out"
    })
}

//Forgot password -- /password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next)=> {
    const data =  await User.findOne({email: req.body.email})

    if(!data){
        return next(new ErrorHandler('User notfound with this email', 404))
    }

    const resetToken = data.getResetToken()
    await data.save({validateBeforeSave: false})

    let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }


    //Create reset url
    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`
    const message = `Your password reset url is as follows\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try{

        sendEmail({
            email: data.email,
            subject: "KobiFamilyMart password recovery",
            message
        })
        res.status(200)
        .json({
            success: true,
            message: `Email send to ${data.email}`
        })

    }catch(error){
        data.resetPasswordToken = undefined
        data.resetPasswordTokenExpired = undefined
        await data.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message, 500))
    }
})

//Reset Password -- /password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next)=> {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const data = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpired: {
            $gt : Date.now()
        }
    })

    if(!data){
        return next(new ErrorHandler('Password reset token is invalid or expired'))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match'))
    }

    data.password = req.body.password
    data.resetPasswordToken = undefined
    data.resetPasswordTokenExpired = undefined

    await data.save({validateBeforeSave: false})

    sendToken(data, 201, res)
}) 

//Get user profile -- /myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) =>{
    const data = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data
    })
})

//Change password -- /password/change
exports.changePassword = catchAsyncError(async (req, res, next) =>{
    const data = await User.findById(req.user.id).select('+password')
    
    //check old password
    if(!await data.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old password is incorrect', 401))
    }
    //assigning new password
    data.password = req.body.password
    await data.save()
    res.status(200).json({
        success: true
    })
})

//Update profile -- /update
exports.updateProfile = catchAsyncError(async (req, res, next) =>{
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.file){
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
        newUserData = {...newUserData, avatar}
    } 

    const data = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data
    })
})

// Admin: Get all users -- /admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) =>{
    const datas = await User.find()
    res.status(200).json({
        success: true,
        count: Object.keys(datas).length,
        datas
    })
})

// Admin: Get specific users -- 
exports.getUser = catchAsyncError(async (req, res, next) =>{
    const data = await User.findById(req.params.id)
    if(!data) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`, 401))
    }
    res.status(200).json({
        success: true,
        data
    })
})

//Admin: Update user

exports.updateUser = catchAsyncError(async (req, res, next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const data = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data
    })
})

//Admin: Delete user
exports.deleteUser = catchAsyncError(async (req, res, next) =>{
    const data = await User.findById(req.params.id)
    if(!data) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`, 401))
    }
    await User.deleteOne(data)   // remove() is deprecated
    res.status(200).json({
        success: true
    })
})