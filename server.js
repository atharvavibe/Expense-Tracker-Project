const express = require('express')

const path = require('path')

const bodyParser = require('body-parser')

const { default: axios } = require('axios')

const sequelize = require('./util/database')
const userCredentialsStatus = require('./routes/routes')

const cors = require('cors')
const user = require('./model/user')

const app = express()

// app.use(bodyParser.json({ extended: false }));
app.use(express.json())

app.use(cors())

app.use('/user', userCredentialsStatus)


sequelize.sync().then(result => {
    app.listen(3000)
})
.catch(err => {
    console.log(err)
})


