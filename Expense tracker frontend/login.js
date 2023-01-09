    async function login(e){
    try{
        e.preventDefault()
        const userLogindetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(userLogindetails)
        const response = await axios.post('http://localhost:3000/user/login', userLogindetails)
        if(response.status === 201){
            console.log('Successful')
        }
        else{
            console.log('Login failed')
        }
    }catch(err){
        console.log(err)
    }
}