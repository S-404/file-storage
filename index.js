const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")

const authRouter = require('./routes/auth-routes')

const authMiddleware = require('./middlewares/auth-middleware')
const apiErrorMiddleware = require('./middlewares/error-middleware')

const PORT = process.env.PORT
const CLIENT_PORT = process.env.CLIENT_PORT
const CLIENT_URL = `${process.env.CLIENT_URL}:${CLIENT_PORT}`


const app = express()

const corsOptions = {
    credentials: true,
    origin: [CLIENT_URL, `http://localhost:${CLIENT_PORT}`],
}

app.use(fileUpload({}))
app.use(cors({...corsOptions}))
app.use(express.json())
app.use(cookieParser())
app.use(express.json())
app.use(express.static('static'))



app.use('/auth', authRouter)
app.use(authMiddleware)

app.use(apiErrorMiddleware)


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        app.listen(PORT, () => {
            console.log('Server started on port ', PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
