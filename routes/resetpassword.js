const sendPasswordLink = require('../controllers/resetpassword')

const express = require('express')
const router = express.Router()

router.use('/forgotpassword', sendPasswordLink.forgotPassword)

module.exports = router