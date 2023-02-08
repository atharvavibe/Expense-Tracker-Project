const Expense = require('../model/expense')



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
    Expense.findAll({ where: {userId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
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
