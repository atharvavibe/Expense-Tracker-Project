const expenseRoutes = require('../controllers/expense')

const express = require('express')

const router = express.Router()

router.post('/add-expense', expenseRoutes.addExpense)

router.get('/get-expense', expenseRoutes.getExpense)

router.delete('/delete-expense/:id', expenseRoutes.deleteExpense)

module.exports = router