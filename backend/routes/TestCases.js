const express = require('express')
// In your testcasesRoutes.js file
const router = express.Router({ mergeParams: true }); // This is crucial

const {auth,isAdmin} = require('../middlewares/Auth')
const {createTestCase,uploadTestCases,createTestCasesFromFile,getTestCases,updateTestCase, deleteTestCase, deleteAllTestCases}  = require('../controllers/TestCases')

router.post('/create',auth,isAdmin,createTestCase)
router.post('/upload',auth,isAdmin,uploadTestCases,createTestCasesFromFile)
router.get('/fetch-testcases',auth,isAdmin,getTestCases)
router.post('/:testcaseID/update',auth,isAdmin,updateTestCase)
router.get('/:testCaseId/delete',auth,isAdmin,deleteTestCase)
router.get('/delete-all-testcases',auth,isAdmin,deleteAllTestCases)

module.exports = router