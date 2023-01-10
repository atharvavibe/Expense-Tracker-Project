const express = require('express')

const path = require('path')

const bodyParser = require('body-parser')

const { default: axios } = require('axios')

const sequelize = require('./util/database')
const userCredentialsStatus = require('./routes/user')
const expenseRoutes = require('./routes/expense')

const cors = require('cors')
const user = require('./model/user')
const expense = require('./model/expense')

const app = express()

// app.use(bodyParser.json({ extended: false }));
app.use(express.json())

app.use(cors())

app.use('/user', userCredentialsStatus)
app.use('/expense', expenseRoutes)


sequelize.sync().then(result => {
    app.listen(3000)
})
.catch(err => {
    console.log(err)
})


