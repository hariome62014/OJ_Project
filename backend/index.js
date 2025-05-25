const express  = require('express')
const dotenv  = require('dotenv')
const connectDB = require('./config/Database')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const userRoutes =  require('./routes/User')
const problemRoutes = require('./routes/Problem')
const testcasesRoutes = require('./routes/TestCases')
const cors = require("cors");


dotenv.config();

const app  = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? JSON.parse(process.env.CORS_ORIGIN) 
    : "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions)); // Only use this once

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