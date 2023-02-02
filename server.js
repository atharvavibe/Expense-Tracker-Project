const express = require('express')

const path = require('path')

const bodyParser = require('body-parser')

const { default: axios } = require('axios')

const sequelize = require('./util/database')
const userCredentialsStatus = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoute = require('./routes/premiumFeature')

const cors = require('cors')
const dotenv = require('dotenv')
const user = require('./model/user')
const expense = require('./model/expense')
const order = require('./model/orders')

const app = express()

// app.use(bodyParser.json({ extended: false }));
app.use(express.json())

dotenv.config()

app.use(cors())

app.use('/user', userCredentialsStatus)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoute)

user.hasMany(expense)
expense.belongsTo(user)

user.hasMany(order)
order.belongsTo(user)

sequelize.sync().then(result => {
    app.listen(3000)
})
.catch(err => {
    console.log(err)
})


