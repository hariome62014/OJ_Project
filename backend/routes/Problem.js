const express = require('express')

const router = express.Router()

const {auth,isAdmin} = require('../middlewares/Auth')
const {createProblem, getAllProblems, getProblemById, updateProblem, deleteProblem}  = require('../controllers/Problem')

router.post('/create-problem',auth,isAdmin,createProblem)
router.post('/problem-list',getAllProblems)
router.get('/:problemId',getProblemById)
router.post('/:problemId/update',auth, isAdmin, updateProblem)
router.get('/:problemId/delete',auth,isAdmin,deleteProblem)


module.exports = router