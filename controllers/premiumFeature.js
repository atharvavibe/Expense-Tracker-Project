const User = require('../model/user')
const Expense = require('../model/expense')
const sequelize = require('../util/database')

const getUserLeaderBoard = async(req, res) => {
    try{
        const leaderboardOfUsers = await User.findAll({
            attributes: ['id', 'username',[sequelize.fn('sum', sequelize.col('expense')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [[sequelize.col("total_cost"), "DESC"]]

    })
        // const userAggregatedExpense = await Expense.findAll({
        //     attributes: ['userId', [sequelize.fn('sum', sequelize.col('expense')), 'total_cost']],
        //     group: ['userID']

        // })
        // expenses.forEach((expense) => {
        //     if(userAggregatedExpense[expense.userId]){
        //     userAggregatedExpense[expense.userId] = userAggregatedExpense[expense.userId] + expense.expense
        //     }else{
        //         userAggregatedExpense[expense.userId] = expense.expense
        //     }
        // })
        // var userLeaderBoardDetails = []
        // users.forEach((user => {
        //     userLeaderBoardDetails.push({name: user.username, total_cost: userAggregatedExpense[user.id]})
        // }))
        // console.log(userLeaderBoardDetails)
        res.status(200).json(leaderboardOfUsers)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}