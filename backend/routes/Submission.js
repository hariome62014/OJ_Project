const express = require('express')

const router = express.Router()

const {auth} = require('../middlewares/Auth')

const {submitSolution} = require('../controllers/compilerController');



router.post('/submit',auth, submitSolution);

module.exports = router;