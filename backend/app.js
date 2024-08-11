const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
app.use('/',require('./routes/products'))
app.use('/',require('./routes/auth'))
app.use(errorMiddleware)

module.exports = app;