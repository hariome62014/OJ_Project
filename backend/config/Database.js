const mongoose  = require('mongoose')
require('dotenv').config()

const connectDB  = async () => {

    try{

        await mongoose.connect(process.env.MONGODB_URL,{
             useNewUrlParser: true,
             useUnifiedTopology: true,
        });

        console.log("DB connected successfully")
         
    }
    catch(error){

        console.log("Error while Connecting DB",error.message);
        process.exit(1)

    }
}

module.exports  = connectDB