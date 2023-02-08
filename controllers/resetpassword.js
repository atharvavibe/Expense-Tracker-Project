const SendInBlue = require('sib-api-v3-sdk')
const uuid = require('uuid')
const bcrypt = require('bcrypt')

const User = require('../model/user')
const Forgotpassword = require('../model/forgotpassword')

exports.forgotpassword = async(req, res) => {

try
{
    const client = SendInBlue.ApiClient.instance
    const {email} = req.body

    const user = await User.findOne({where:{email}})

    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY

    if(user){
            
            const id = uuid.v4()
            user.createForgotpassword({id, active: true}).catch(err => {
                throw new Error(err)
            })
            const tranEmailApi = new SendInBlue.TransactionalEmailsApi()

            const sender = {
            email: 'cyclonicbattles@gmail.com'
            }

            const receiver = [
            {
                email: email
            }
            ]

        tranEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: 'Password reset',
            textContent:`Here is the link to reset your password : 
            <a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        }).then((response) => {
            return res.status(200).json({message:'Link to reset your password sent to your mail', success: true})
        })
        .catch(err => {
            console.log(err)
        })
    }else{
        throw new Error('User does not exist')
    }
}catch(err){
    console.log(err)
 }
}

exports.resetpassword = (req, res) => {
    const id = req.params.id
    console.log(req.params)
    Forgotpassword.findOne({where: {id}}).then(forgotpasswordrequest => {
        console.log(forgotpasswordrequest)
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({active: false})
                res.status(200).send(`<html>
                <script>
                    function formsubmitted(e){
                        e.preventDefault();
                        console.log('called')
                    }
                </script>
                <form action="/password/updatepassword/${id}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button>reset password</button>
                </form>
            </html>`)
            res.end()
        }
    })
}

exports.updatepassword = (req, res) => {
    try{
        const {newpassword} = req.query
        console.log(req.query)
        const {resetpasswordid} = req.params
        console.log(req.params)
        Forgotpassword.findOne({where: {id: resetpasswordid}}).then(resetpasswordrequest => {
            console.log(resetpasswordrequest)
            User.findOne({where: {id: resetpasswordrequest.userId}}).then(user => {
                console.log('userDetails', user)
                if(user){
                    const saltRounds = 10
                    bcrypt.genSalt(saltRounds, function(err, salt){
                        if(err){
                            console.log(err)
                            throw new Error(err)
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash){
                            if(err){
                                console.log(err)
                                throw new Error(err)   
                            }
                            user.update({password: hash}).then(() => {
                                res.status(201).json({message: 'Successfully updated the new password'})
                            })
                        })
                    })
                }else{
                    return res.status(404).json({error: 'No user exists', success: false})
                }
            })
        })

    }catch(error){
        return res.status(403).json({error, success: false})
    }
}
