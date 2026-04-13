import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './assets/PublicPages/Home/Home'
import Login from './assets/PublicPages/Login/Login'
import Dashboard from './assets/PrivatePages/Main/Main'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
