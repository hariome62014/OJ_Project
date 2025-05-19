const express  = require('express')
const dotenv  = require('dotenv')
const connectDB = require('./config/Database')
const cookieParser = require('cookie-parser')
const userRoutes =  require('./routes/User')
dotenv.config();

const app  = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth',userRoutes)

connectDB();

const port  =  process.env.PORT || 5000

app.listen(port,(
    console.log(`Backend is listening on port ${port}`)
))