import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './assets/PublicPages/Home/Home'
import Login from './assets/PublicPages/Login/Login'
import Dashboard from './assets/PrivatePages/Main/Main'
import { AuthProvider } from './context/AuthContext'
import { StopsProvider } from './context/DataContext'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './assets/PublicPages/Register/Register'
import Pending from './assets/PublicPages/Pending/Pending'
import MissingPage from './assets/PublicPages/404Page/MissingPage'
import { DirectusProvider } from './context/DirectusContext'
import A4Page from './assets/PrivatePages/Print/A5Page'
import MemoPage from './assets/PrivatePages/Print/MemoPage'

function App() {

  return (
    <AuthProvider>
      <StopsProvider>
        <DirectusProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pending" element={<Pending />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/a4print" element={<ProtectedRoute><A4Page /></ProtectedRoute>} />
            <Route path="/memoprint" element={<ProtectedRoute><MemoPage /></ProtectedRoute>} />
            <Route path="*" element={<MissingPage />} />
          </Routes>
        </DirectusProvider>
      </StopsProvider>
    </AuthProvider>
  )
}

export default App
