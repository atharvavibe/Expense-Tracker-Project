const purchaseController = require('../controllers/purchase')
const userauthentication = require('../middleware/auth')

const express = require('express')
const router = express.Router()

router.get('/premium-membership',userauthentication.authenticate, purchaseController.purchasepremium)
router.post('/update-transaction-status',userauthentication.authenticate, purchaseController.updatetransactionstatus)

module.exports = router