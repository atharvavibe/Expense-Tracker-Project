const expenseRoutes = require('../controllers/expense')
const userauthentication = require('../middleware/auth')

const express = require('express')

const router = express.Router()

router.post('/add-expense', expenseRoutes.addExpense)

router.get('/get-expense', userauthentication.authenticate, expenseRoutes.getExpense)

router.delete('/delete-expense/:id', expenseRoutes.deleteExpense)

module.exports = router