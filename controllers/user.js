const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function isStrInvalid(string){
    if(string == undefined || string.length === 0){
        return true
    } else {
        return false;
    }
}


exports.signup = async(req, res) => {

    try{
        const {username, email, password} = req.body
        console.log(username, email, password)
        if(isStrInvalid(username) || isStrInvalid(email) || isStrInvalid(password)){
                return res.status(400).json({err: "Bad paramenters....something is missing"})
            }
            bcrypt.hash(password, 10, async (err, hash) => {
                User.create({username, email, password : hash}).then(() => {
                res.status(201).json({message: 'Successfully created a new user'})
            })
        })

    }catch(err){
        console.log(err)
    }

}

const generateAccessToken = (id, username, ispremiumuser) => {
    return jwt.sign({ userId: id, username: username, ispremiumuser}, process.env.TOKEN_SECRET_KEY)
}

exports.login = async(req, res) => {
    try{
        const {email, password} = req.body
        if(isStrInvalid(email) || isStrInvalid(password)){
                return res.status(400).json({message: 'Email id or password is missing'})
            }
        console.log(email, password)

        const user = await User.findAll({where: {email}}).then(user => {
           if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(result === true){
                res.status(201).json({success: true, message: "User logged in successfully" ,token: generateAccessToken(user[0].id, user[0].username, user[0].ispremiumuser)})
            }else{
                return res.status(400).json({success: false, message: "password incorrect"})
            }  
            })
           }else{
            return res.status(404).json({success: false, message: "User does not exists"})
           }
        })

    }catch(err){
        console.log(err)
    }
}

exports.generateAccessToken = generateAccessToken