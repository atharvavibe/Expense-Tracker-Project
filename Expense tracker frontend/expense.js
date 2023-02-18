
const balance = document.getElementById('balance')
const money_plus = document.getElementById('money-plus')
const money_minus = document.getElementById('money-minus')
const list = document.getElementById('list')
const form = document.getElementById('form')
const description = document.getElementById('description')
const expense = document.getElementById('expense')
const pagination = document.getElementById('pagination')
const token = localStorage.getItem('token')
var numberOfRows = document.getElementById('rows')
var rows = numberOfRows.options[numberOfRows.selectedIndex].value


let transactions = []
let currentPage = 1
var id = 0
const limit = rows
// var currentPage = 1

function download(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Download'
    inputElement.classList = 'downloadBtn'
    axios.get('http://localhost:3000/expense/download', {headers : {"Authorization": token}})
    .then((response) => {
        console.log(response)
        if(response.status === 200){
            var a = document.createElement("a")
            a.href = response.data.fileURL
            a.download = 'myexpense.csv'
            a.click()
        }else{
            throw new Error(response.data.message)
        }
    }).catch((err) => {
        console.log(err)
    })
}

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
        //console.log(transactions)

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
    console.log(rows)
    var page = 1
    var currentPage = 1
    const token = localStorage.getItem('token')
    const decodedToken = parseJwt(token)
    console.log(decodedToken)
    const isAdmin = decodedToken.ispremiumuser
    if(isAdmin){
        showPremiumUserMessage()
        showLeaderBoard()
        
    }
    axios.get(`http://localhost:3000/expense/get-expense?page=${page}` , { headers: {"Authorization": token}})
    .then(response => {
        showPagination(response.data.allexpenses, currentPage)
        response.data.allexpenses.forEach(expense => {
            transactions.push(expense)
            updateValues()
        })
    })
})

function showPagination(allexpenses, currentPage){
 
    currentPage--
    list.innerHTML = ""
    let start = limit * currentPage
    let end = start + limit 
    console.log(currentPage)
    let paginatedItems = allexpenses.slice(start, end)
    paginatedItems.forEach(amount => {
        addTransactionDOM(amount)
    })

    setPagination(allexpenses, pagination, limit, currentPage)
}

function setPagination(allexpenses, wrapper, limit, currentPage){
    wrapper.innerText = ""
    var lastPage = Math.ceil(allexpenses.length / limit)
    for(var i = 1; i <= lastPage; i++){
        var btn = paginationBtn(i, allexpenses, currentPage)
        wrapper.appendChild(btn)
    }
}

function paginationBtn(page, allexpenses, currentPage){
    var button = document.createElement('button')
    button.classList.add("pageNumber")
    button.innerText = page

    if(currentPage == page) button.classList.add('active')

    button.addEventListener('click', function(){
        currentPage = page
        // console.log(currentPage)
        showPagination(allexpenses, currentPage)
    })
    return button

}

function showPremiumUserMessage(){
    document.getElementById('premiumBtn').style.visibility = "hidden"
    document.getElementById('message').innerHTML = 'Premium'
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
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premium-membership', {headers: {"Authorization":token}})
    console.log(response)
    var options =
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        // This handler function is a callback function received form razorpay after successfull payment
        "handler": async function(response){
           const res = await axios.post('http://localhost:3000/purchase/update-transaction-status',{
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
    inputElement.value = 'Show Leaderboard'
    inputElement.classList = 'btn'
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showleaderboard',{headers: {"Authorization":token}})
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>${userDetails.username}: ₹${userDetails.total_cost}`
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
        //showPagination(expenseDetails, currentPage)
        const token = localStorage.getItem('token')
        axios.post('http://localhost:3000/expense/add-expense',expenseDetails,  {headers: {"Authorization": token}}).then(response => {
            console.log(response.data.expenses)
            Init()
            addTransaction(e,response.data.expenses.id )
            console.log(transactions)
            showPagination(transactions, currentPage)
        })
    }catch(err){
        console.log(err)
    }
}