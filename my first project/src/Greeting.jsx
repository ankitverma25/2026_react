import React from 'react'

function Greeting({ name , city, isMember}) {
  return (
    <>

    <div>
        <h1>Hello, {name}!</h1>
        <p>You are from {city}.</p>
        {isMember && <p>Welcome, premium member!</p>}
        {!isMember && <p>Join our membership for exclusive benefits.</p>}
        {isMember ? <p>Welcome, premium member!</p> : <p>Join our membership for exclusive benefits.</p>}

    </div>
    
    
    
    </>
  )
}

export default Greeting