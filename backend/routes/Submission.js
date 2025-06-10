const express = require('express')

const router = express.Router()

const {auth} = require('../shared/middlewares/Auth')

const {submitSolution,getUserProblemSubmissions} = require('../controllers/Submission');




// router.post('/submit',auth, submitSolution);
router.post('/user/:userId',auth, getUserProblemSubmissions)

module.exports = router;