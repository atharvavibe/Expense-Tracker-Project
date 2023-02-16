const Expense = require('../model/expense')
const User = require('../model/user')
const s3services = require('../services/s3services')

const AWS = require('aws-sdk')

const ITEMS_PER_PAGE = 4

exports.addExpense = async(req, res) => {
    try{
        const{expense, description} = req.body
        if(expense == undefined || expense.length === 0){
            return res.status(400).json({err: "Bad paramenters....something is missing"})
        }
        // console.log(req.user)
        Expense.create({expense, description , userId: req.user.id}).then((expenses) => {
            res.status(201).json({expenses, message : 'Sucessfully added the expense'})
        })
    }catch(err){
        console.log(err)
    }
}

exports.getExpense = async(req, res) => {
    const page = +req.query.page || 1
    var totalItems
    const total = await Expense.count()
    totalItems = total
    Expense.findAll({ where: {userId: req.user.id}}, {offset: (page - 1)*ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE}).then(expenses => {
        // console.log(expenses)
        // return res.status(200).json({expenses, success: true})
        res.json({
            allexpenses: expenses, 
            pageData:{
            currentPage: page,
            limit: ITEMS_PER_PAGE,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: +page + 1,
            hasPreviousPage: page > 1,
            previousPage: +page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            }
        })
    })
    .catch(err => {
        return res.status(500).json({error: err, success: false})
    })
}

exports.deleteExpense = async(req, res) => {
    const expenseid = req.params.id
    console.log(expenseid)
Expense.destroy({where: {id: expenseid ,userId: req.user.id}}).then((noOfRows) => {
        if(noOfRows === 0){
            return res.status(404).json({success: false, message: "Expense does not belong to the user"})
        }
        return res.status(200).json({success: true, message: "Deleted successfully"})
    }).catch(err => {
        console.log(err)
        return res.status(403).json({sucess: false, message:"Failed"})
    })
}



exports.downloadExpense = async (req, res) => {
    try{
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
    
        try{
        Expense.findAll({ where: {userId: req.user.id}}).then( async expenses => {
        
        const userId = req.user.id 
        const stringyfiedExpense = JSON.stringify(expenses)
        const filename = `Expense${userId}/${new Date()}.txt`
        const fileURL = await s3services.uploadTos3(stringyfiedExpense, filename)
        res.status(200).json({fileURL, success: true})
        })
        }catch(err) {
            console.log(err)
            res.status(500).json({fileURL: '', success: false, err: err})
    }
}
    catch(err) {
        console.log(err);
    }
}
