// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
  checkUsernameUnique
//   changePassword,
} = require("../controllers/Auth")


const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")



// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

router.post('/check-username', checkUsernameUnique);



module.exports = router;