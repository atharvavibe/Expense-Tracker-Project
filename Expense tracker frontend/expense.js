const balance = document.getElementById('balance')
const money_plus = document.getElementById('money-plus')
const money_minus = document.getElementById('money-minus')
const list = document.getElementById('list')
const form = document.getElementById('form')
const description = document.getElementById('description')
const expense = document.getElementById('expense')

let transactions = []
var id = 0


// Add transaction
 function addTransaction(e, id){
    e.preventDefault()
    if(description.value.trim() ==="" || expense.value.trim() === ""){
        alert("Please Enter Text and Value")
    }else{
        const transaction = {
            id:id++,
            description: description.value,
            expense: +expense.value
        }
        transactions.push(transaction)
        addTransactionDOM(transaction)
        updateValues()
        description.value = ""
        expense.value = ""
        console.log(transactions)

    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token')
    const decodedToken = parseJwt(token)
    console.log(decodedToken)
    const isAdmin = decodedToken.ispremiumuser
    if(isAdmin){
        showPremiumUserMessage()
        showLeaderBoard()
    }
    axios.get('http://localhost:3000/expense/get-expense' , { headers: {"Authorization": token}}).then(response => {
        console.log(response.data.expenses)
        console.log(transactions)
        response.data.expenses.forEach(expense => {
            addTransactionDOM(expense)
            transactions.push(expense)
            updateValues()
        })
    })
})


function showPremiumUserMessage(){
    document.getElementById('premiumBtn').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "Premium"
}

function addTransactionDOM(transaction){
    const sign = transaction.expense < 0 ? "-" : "+"
    const item = document.createElement("li")
    item.classList.add(
        transaction.expense < 0 ? "minus" : "plus"
    )

    item.innerHTML = `${transaction.description}<span>${sign}₹${Math.abs(transaction.expense)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`

    list.appendChild(item)
}

// Remove transaction
function removeTransaction(id){
    console.log('click')
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/delete-expense/${id}`, {headers: {"Authorization": token}}).then(response => {
    transactions = transactions.filter((transaction) => transaction.id !== id)
    Init()
  }).catch((err) => {
    console.log(err)
  })
}

document.getElementById('premiumBtn').onclick = async function (e){
    console.log('click')
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premium-membership', {headers: {"Authorization":token}})
    console.log(response)
    var options =
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        // This handler function is a callback function received form razorpay after successfull payment
        "handler": async function(response){
            await axios.post('http://localhost:3000/purchase/update-transaction-status',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, {headers: {"Authorization": token}})

            alert('You are a Premium user now')
            showPremiumUserMessage()
            localStorage.setItem('isAdmin', true)
            localStorage.setItem('token', res.data.token)
            showLeaderBoard()
        }
    }

    const rzp = new Razorpay(options)
    rzp.open()
    e.preventDefault()

    rzp.on('payment.failed', function(response){
        console.log(response)
        alert('Something went wrong')
    })

}

function showLeaderBoard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'show Leaderboard'
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showleaderboard',{headers: {"Authorization":token}})
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.total_cost}`
        })
    }
    document.getElementById('message').appendChild(inputElement)
}

//Update values
function updateValues(){
    const amounts = transactions.map(transaction => transaction.expense)
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2)
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0)* -1
    ).toFixed(2)

    balance.innerText = `₹${total}`
    money_plus.innerText = `₹${income}`
    money_minus.innerText = `₹${expense}`
}

//Init App
function Init(){
    list.innerHTML = ""
    transactions.forEach(addTransactionDOM)
    updateValues()
}


 function sendDataTobackend(e){
    e.preventDefault()
    try{
        const expenseDetails = {
            description: e.target.description.value,
            expense: e.target.expense.value
        }
        console.log(expenseDetails)
        const token = localStorage.getItem('token')
        axios.post('http://localhost:3000/expense/add-expense',expenseDetails,  {headers: {"Authorization": token}}).then(response => {
            console.log(response.data.expenses.id)
            Init()
            addTransaction(e,response.data.expenses.id )
        })
    }catch(err){
        console.log(err)
    }
}

