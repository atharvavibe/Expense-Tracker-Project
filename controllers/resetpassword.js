// const SendInBlue = require('sib-api-v3-sdk')

// exports.forgotPassword = async(req, res) => {

// try
// {
//     const client = SendInBlue.ApiClient.instance
//     const {emailId} = req.body

//     const apiKey = client.authentications['api-key']
//     apiKey.apiKey = process.env.SENDINBLUE_API_KEY

//     const tranEmailApi = new SendInBlue.TransactionalEmailsApi()

//     const sender = {
//       email: 'cyclonicbattles@gmail.com'
//     }

//     const receiver = [
//       {
//         email: emailId
//       }
//     ]

//    tranEmailApi.sendTransacEmail({
//       sender,
//       to: receiver,
//       subject: 'Password reset',
//       textContent:`Here is the link to reset your password`
//    }).then((response) => {
//     return res.status(response[0].statusCode).json({message:'Link to reset your password sent to your mail', success: true})
//    })
//    .catch(err => {
//     console.log(err)
//   })
// }catch(err){
//     console.log(err)
//  }
// }

const sendgrid = require('@sendgrid/mail')
const { text } = require('body-parser')

const User = require('../model/user')

exports.forgotpassword = async (req, res) => {
    try{
        const {email} = req.body
        console.log(req.body)
        const user = await User.findOne({where:{email}})
        if(user){
            sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: user.email,
                from: 'cyclonicbattles@gmail.com',
                subject: 'Password reset link',
                text: 'Here is the Password reset link : '
            }

            sendgrid
            .send(msg)
            .then((response) => {
                return res.status(response[0].statusCode).json({message :'Link to reset password sent to your mail ', sucess: true})
            })
            .catch(error => {
                throw new Error(error)
            })
        }else{
            throw new Error('User does not exist')
        }
    }catch(err){
        console.log(err)
        return res.json({message: err, sucess: false})
    }
}