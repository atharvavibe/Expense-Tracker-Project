const express = require('express')

// const path = require('path')

// const fs = require('fs')

const bodyParser = require('body-parser')

const { default: axios } = require('axios')

const helmet = require('helmet')

const morgan = require('morgan')

const sequelize = require('./util/database')
const userCredentialsStatus = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoute = require('./routes/premiumFeature')
const forgotPasswordRoute = require('./routes/resetpassword')

const cors = require('cors')
const dotenv = require('dotenv')
const user = require('./model/user')
const expense = require('./model/expense')
const order = require('./model/orders')
const forgotpassword = require('./model/forgotpassword')

const app = express()

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
    )

// app.use(bodyParser.json({ extended: false }));
app.use(express.json())

dotenv.config()

app.use(cors())
app.use(helmet())
app.use(morgan('combined', {stream: accessLogStream}))

app.use('/user', userCredentialsStatus)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoute)
app.use('/password', forgotPasswordRoute)

user.hasMany(expense)
expense.belongsTo(user)

user.hasMany(order)
order.belongsTo(user)

user.hasMany(forgotpassword)
forgotpassword.belongsTo(user)

sequelize.sync().then(result => {
    app.listen(process.env.PORT || 3000)
})
.catch(err => {
    console.log(err)
})


