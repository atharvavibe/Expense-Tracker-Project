async function forgotPassword(e){
    try{
        e.preventDefault()
        const userEmail =  {email: e.target.email.value}
        console.log(userEmail)
        const response = axios.post('http://localhost:3000/password/forgotpassword', userEmail)
    }catch(err){
        console.log(err)
    }
}