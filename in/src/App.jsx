import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Home from './Home'
import About from './About'
import { Link, NavLink, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
  <>

  <Link to="/" >Home</Link>|<Link to="/about">About</Link>
  <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/About' element={<About/>}/>
  </Routes>
  
  </>
  )
}

export default App
