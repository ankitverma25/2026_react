import React from 'react'
import userContext from './UserContext'
import { useContext } from 'react'

function UserList() {
    const users = [
  { id: 1, name: "Ankit" },
  { id: 2, name: "Varun" },
  { id: 3, name: "Shivam" },
];

const name = useContext(userContext)

  return (
    <>


    <ul>
    {users.map((user)=><li key={user.id}>{user.name}</li>)}
    </ul>
    {name}
    
    </>
  )
}

export default UserList