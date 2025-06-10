const express = require('express')
const router = express.Router()


const codeReview = require( '../controllers/CodeReview')


router.post('/code',codeReview)


module.exports = router