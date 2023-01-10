const balance = document.getElementById('balance')
const money_plus = document.getElementById('money-plus')
const money_minus = document.getElementById('money-minus')
const list = document.getElementById('list')
const form = document.getElementById('form')
const description = document.getElementById('description')
const expense = document.getElementById('expense')

let transactions = []

// Add transaction
 function addTransaction(e){
    e.preventDefault()
    if(description.value.trim() ==="" || expense.value.trim() === ""){
        alert("Please Enter Text and Value")
    }else{
        const transaction = {
            id: id.value,
            description: description.value,
            expense: +expense.value
        }
        transactions.push(transaction)
        addTransactionDOM(transaction)
        updateValues()
        description.value = ""
        expense.value = ""
    }
}

// Generate id 
// function generateID(){
//     return Math.floor(Math.random()*100000000)
// }

window.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/expense/get-expense').then(response => {
        console.log(response.data.expenses)
        console.log(transactions)
        response.data.expenses.forEach(expense => {
            addTransactionDOM(expense)
            transactions.push(expense)
            updateValues()
        })
    })
})


function addTransactionDOM(transaction){
    const sign = transaction.expense < 0 ? "-" : "+"
    const item = document.createElement("li")
    item.classList.add(
        transaction.expense < 0 ? "minus" : "plus"
    )

    item.innerHTML = `${transaction.description}<span>${sign}$${Math.abs(transaction.expense)}</span>
    <button class="delete-btn onclick="removeTransaction(${transaction.id})">x</button>`

    list.appendChild(item)
}

// Remove transaction
function removeTransaction(id){
    axios.delete(`http://localhost:3000/expense/delete-expense/${id}`).then(response => {
    transactions = transactions.filter((transaction) => transaction.id !== id)
    Init()
  }).catch((err) => {
    console.log(err)
  })
}

//Update values
function updateValues(){
    const amounts = transactions.map(transaction => transaction.expense)
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2)
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0)* -1
    ).toFixed(2)

    balance.innerText = `$${total}`
    money_plus.innerText = `$${income}`
    money_minus.innerText = `$${expense}`
}

//Init App
function Init(){
    list.innerHTML = ""
    transactions.forEach(addTransactionDOM)
    updateValues()
}

Init()
form.addEventListener("submit", addTransaction)

async function sendDataTobackend(e){
    e.preventDefault()
    try{
        const expenseDetails = {
            description: e.target.description.value,
            expense: e.target.expense.value
        }
        console.log(expenseDetails)
        const response = await axios.post('http://localhost:3000/expense/add-expense', expenseDetails)
    }catch(err){
        console.log(err)
    }
}

