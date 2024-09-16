const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({path:path.join(__dirname, "config", "config.env")})

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname,'uploads') ) )

app.use('/',require('./routes/products'))
app.use('/',require('./routes/auth'))
app.use('/',require('./routes/order'))
app.use('/',require('./routes/payment'))
app.use(errorMiddleware)

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

module.exports = app;