import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Greeting from './Greeting'
import UserList from './UserList'
import LoginForm from './LoginForm'
import FocusDemo from './FocusDemo'
import userContext from './UserContext'

function App() {
  const [count, setCount] = useState(0)
  let name= "ankit"
  let name1= "ankit"



  return (
    <userContext.Provider value={name1}>
      <section id="center">
        <h1>{name}</h1>
        <p>learner from lucknow</p>
        <Greeting city="lucknow" name={name} ismember={true} />
        <Greeting city="barabanki" name="varun" ismember={false} />
        <UserList/>

<LoginForm/>
<FocusDemo/>


        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>
    </userContext.Provider>
  )
}

export default App
