const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser')
const path = require('path')

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname,'uploads') ) )

app.use('/',require('./routes/products'))
app.use('/',require('./routes/auth'))
app.use('/',require('./routes/order'))
app.use(errorMiddleware)

module.exports = app;