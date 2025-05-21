const express  = require('express')
const dotenv  = require('dotenv')
const connectDB = require('./config/Database')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const userRoutes =  require('./routes/User')
const problemRoutes = require('./routes/Problem')
const testcasesRoutes = require('./routes/TestCases')

dotenv.config();

const app  = express();

app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth',userRoutes)
app.use('/api/v1/problems',problemRoutes)
app.use('/api/v1/problems/:problemId/test-cases', testcasesRoutes);

connectDB();

const port  =  process.env.PORT || 5000

app.listen(port,(
    console.log(`Backend is listening on port ${port}`)
))