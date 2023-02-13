const expenseRoutes = require('../controllers/expense')
const userauthentication = require('../middleware/auth')

const express = require('express')

const router = express.Router()

router.post('/add-expense', userauthentication.authenticate, expenseRoutes.addExpense)

router.get('/get-expense', userauthentication.authenticate, expenseRoutes.getExpense)

router.get('/download', userauthentication.authenticate, expenseRoutes.downloadExpense)

router.delete('/delete-expense/:id',userauthentication.authenticate, expenseRoutes.deleteExpense)

module.exports = router