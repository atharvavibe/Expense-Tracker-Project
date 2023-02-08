const resetpasswordcontroller = require('../controllers/resetpassword')

const express = require('express')
const router = express.Router()

router.get('/resetpassword/:id', resetpasswordcontroller.resetpassword)
router.get('/updatepassword/:resetpasswordid', resetpasswordcontroller.updatepassword)
router.use('/forgotpassword', resetpasswordcontroller.forgotpassword)

module.exports = router