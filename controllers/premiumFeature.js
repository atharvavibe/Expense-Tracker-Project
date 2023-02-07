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
        res.status(200).json(leaderboardOfUsers)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}