const Expense = require('../model/expense')



exports.addExpense = async(req, res) => {
    try{
        const{expense, description} = req.body
        if(expense == undefined || expense.length === 0){
            return res.status(400).json({err: "Bad paramenters....something is missing"})
        }
        Expense.create({expense, description}).then(() => {
            res.status(201).json({message : 'Sucessfully added the expense'})
        })
    }catch(err){
        console.log(err)
    }
}

exports.getExpense = async(req, res) => {
    Expense.findAll().then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        return res.status(500).json({error: err, success: false})
    })
}

exports.deleteExpense = async(req, res) => {
    const expenseid = req.params.id
    console.log(expenseid)
    Expense.destroy({where: {id: expenseid}}).then(() => {
        return res.status(200).json({success: true, message: "Deleted successfully"})
    }).catch(err => {
        console.log(err)
        return res.status(403).json({sucess: false, message:"Failed"})
    })
}