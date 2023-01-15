const Razorpay = require('razorpay')
const Order = require('../model/orders')

exports.purchasepremium = async (req, res) => {
    try{
        var rzp = new Razorpay({
            key_id: /*process.env.RAZORPAY_KEY_ID*/'rzp_test_pQdffihTjMaJc9',
            key_secret: /*process.env.RAZORPAY_KEY_SECRET*/'nNVxGnMgmuoyxZUhRSyYU3VY'
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

exports.updatetransactionstatus = (req, res) => {
    try{
        const {payment_id, order_id} = req.body
        Order.findOne({where: {orderid: order_id}}).then(order => {
            order.update({paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                return res.status(202).json({success: true, message: "Transaction Successful"})
            }).catch(err => {
                throw new Error(err)
            })
        }).catch((err) => {
            throw new Error(err)
        })
    }catch(err){
        throw new Error(err)
    }
}