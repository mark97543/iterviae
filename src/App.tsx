import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './assets/PublicPages/Home/Home'
import Login from './assets/PublicPages/Home/Parts/Login'
import Dashboard from './assets/PrivatePages/Main/Main'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
