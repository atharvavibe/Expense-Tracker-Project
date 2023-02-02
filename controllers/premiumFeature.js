const User = require('../model/user')
const Expense = require('../model/expense')
const sequelize = require('../util/database')

const getUserLeaderBoard = async(req, res) => {
    try{
        const users = await User.findAll()
        const expenses = await Expense.findAll()
        const userAggregatedExpense = {}
        expenses.forEach((expense) => {
            if(userAggregatedExpense[expense.userId]){
            userAggregatedExpense[expense.userId] = userAggregatedExpense[expense.userId] + expense.expense
            }else{
                userAggregatedExpense[expense.userId] = expense.expense
            }
        })
        var userLeaderBoardDetails = []
        users.forEach((user => {
            userLeaderBoardDetails.push({name: user.username, total_cost: userAggregatedExpense[user.id]})
        }))
        console.log(userLeaderBoardDetails)
        res.status(200).json(userLeaderBoardDetails)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}