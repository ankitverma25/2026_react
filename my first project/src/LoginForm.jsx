import React from 'react'
import { useState ,useEffect } from 'react'

function LoginForm() {

    const [username, setUsername] = useState('');
    const [password,setPassword] = useState('');

    const handleSubmit=(e)=>{
        e.preventDefault()
        
        console.log("hi",username)
        setUsername('');
        setPassword("")
    
    }
    useEffect(()=>{console.log("hi")},[])
  return (
    <>

    <form onSubmit={handleSubmit}>
        <input
        type='text'
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        placeholder='username'/>
        <input
        type='text'
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        placeholder='password'/>
       <button type='submit'>Login</button>


    </form>

    
    
    </>
  )
}

export default LoginForm