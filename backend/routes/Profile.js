// Import required modules
const express = require("express");
const router = express.Router();

// Import controllers and middleware
const { getUserStats ,getStats,updateDisplayPicture} = require("../controllers/ProfilePageDataController");
const { auth } = require("../shared/middlewares/Auth");

const multer = require('multer');
const upload = multer();

// Define the route
router.get("/getUserDetails/data/:userId", auth, getUserStats);

router.get('/stats',getStats)

router.put('/updateDisplayPicture',
    upload.single('displayPicture'), 
    auth,updateDisplayPicture
)

// Export the router
module.exports = router;
