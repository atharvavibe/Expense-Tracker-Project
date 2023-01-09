async function signup(e){
    try{
        e.preventDefault()
        console.log(e.target.name.value)
        const userSignupdetails = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(userSignupdetails)
        const response = await axios.post('http://localhost:3000/user/signup', userSignupdetails)

        if(response.status === 201){
            window.location.href = "login.html"
        }
        else{
            console.log('Login failed')
        }
    }catch(err){
        document.body.innerHTML += `<div style="color:red;">${err}</div>`
    }
}