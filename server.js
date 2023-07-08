const express = require("express")
const dotenv = require("dotenv").config()
const connectDB = require("./config/dbConnection")
const session = require("express-session")
const bodyparser = require('body-parser')
const errorHandler = require("./middleware/errorHandler")
const path = require('path')
const ejs = require('ejs')

const app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// serve static files from the 'public' folder
// app.use(express.static('public'));

const port = process.env.PORT || 5006

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
  }));

connectDB()
app.use(express.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use("/tutor",require("./routes/tutorRoutes"))
app.use("/course",require("./routes/courseRoutes.js"))
app.use("/student",require("./routes/studentRoutes.js"))
app.use("/schedule",require("./routes/scheduleRoutes.js"))
app.use(errorHandler)

app.listen(port,(req,res)=>{
    console.log(`Started listening this project at ${port} port location`)
})