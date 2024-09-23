const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const path = require('path')
app.use(express.static('public'))
app.use(express.json())
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")

const flash = require('connect-flash')
const expressSession = require('express-session')
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.EXPRESS_SESSION_SECRET
}))
app.use(flash())

const{connectDb}=require('./config/db')
const PORT = process.env.PORT

const ownerRouter = require('./routes/owner.router')
const userRouter = require('./routes/user.router')
const productRouter = require('./routes/product.router')
const indexRouter = require('./routes/index.router')
const { expression } = require('joi')
const session = require('express-session')

app.use('/owners',ownerRouter)
app.use('/users',userRouter)
app.use('/products',productRouter)
app.use('/',indexRouter)

connectDb()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running at ${PORT} `)
    })
})


