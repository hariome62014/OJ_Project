const express = require('express')

const router = express.Router()

const {auth} = require('../shared/middlewares/Auth')

const {submitSolution} = require('../controllers/SubmitCode');

router.post('/submit', auth,submitSolution);

module.exports = router;