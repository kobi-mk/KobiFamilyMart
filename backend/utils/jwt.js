const sendToken = (data, statusCode, res)=> {
    //Creating JWT Token
    const token = data.getJwtToken()

    //Setting cookies
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        data,
        token
    })
}
module.exports = sendToken