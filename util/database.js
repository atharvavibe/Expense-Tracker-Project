const Sequelize = require('sequelize')


const sequelize = new Sequelize('expense-tracker', 'root', '212005',{
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize