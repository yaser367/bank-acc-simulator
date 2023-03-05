const express = require('express')
const app = express()
require('dotenv').config()

const connectDB = require('./database/mongoDBConfig')
const bankRouter = require('./routes/bankRouter')

app.use(express.json())
app.use('/', bankRouter)
connectDB()
app.listen(process.env.PORT, console.log(`listening...port${process.env.PORT}`));