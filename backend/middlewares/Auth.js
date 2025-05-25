const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();

//auth
exports.auth = async (req, res, next) => {
	
	try {
		// console.log("Reached Middleware Auth",req.body,"Header",req.header("Authorization").replace("Bearer ", ""))
		// Extracting JWT from request cookies, body or header
		console.log("req.body" , req.body);
		const token =(req.header("Authorization") && req.header("Authorization").replace("Bearer ", "")) ||
  req.body.token ||
  
  req.cookies.token;

		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {
			// Verifying the JWT using the secret key stored in environment variables
			console.log("Auth token:",token)
			const decode =    jwt.verify(token, process.env.JWT_SECRET);
			// Storing the decoded JWT payload in the request object for further use
			req.user = decode;
		} catch (error) {
			console.log("Error:",error)
			// If JWT verification fails, return 401 Unauthorized response
			return res
				.status(401)
				.json({ success: false, message: "token is invalid",error });
		}

		// If JWT is valid, move on to the next middleware or request handler
		next();
	} catch (error) {
		// If there is an error during the authentication process, return 401 Unauthorized response
        console.log("Error in auth",error);
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};



//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{

		console.log("Reched isAdmin Middleware")

        console.log("UserRoles:",req.user)
           if(req.user.role !== "admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }