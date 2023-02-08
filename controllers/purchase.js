const Razorpay = require('razorpay')
const Order = require('../model/orders')
const userController = require('./user')

exports.purchasepremium = async (req, res) => {
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 10000
        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err){
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                console.log("orderid", order.id)
                console.log('user', req.user)
                return res.status(201).json({order, key_id : rzp.key_id})
            }).catch(err => {
                console.log(err)
            })
        })
    }catch(err){
        console.log(err)
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

exports.updatetransactionstatus = async (req, res) => {
    try{
        const userId = req.user.id
        const {payment_id, order_id} = req.body
        const order = await Order.findOne({where: {orderid: order_id}})
        const promise1 = order.update({paymentid: payment_id, status: 'SUCCESSFUL'})
        const promise2 = req.user.update({ispremiumuser: true})
        Promise.all([promise1, promise2]).then(() => {
          return res.status(202).json({success: true, message: "Transaction Successful", token: userController.generateAccessToken(userId, undefined, true)})
       })
              
    }catch(err){
        throw new Error(err)
        res.status(403).json({errpr: err, message: 'Something went wrong'})
    }
}