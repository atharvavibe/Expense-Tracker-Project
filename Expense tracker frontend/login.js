    async function login(e){
    try{
        e.preventDefault()
        const userLogindetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(userLogindetails)
        const response = await axios.post('http://localhost:3000/user/login', userLogindetails)
        alert(response.data.message)
        localStorage.setItem('token', response.data.token)
        window.location.href = "/views/expense.html"
    }catch(err){
        console.log(err)
    }
}