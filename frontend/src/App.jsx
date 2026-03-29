import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import DashBoard from './pages/DashBoard'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import AppContext from './context/AppContext'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [token, setToken] = useState('')

  const backendUrl = 'https://task-manager-anythingai.onrender.com'

  useEffect(() => {
    const t = Cookies.get('token')
    setToken(t)
  }, [])

  const updateToken = (newToken) => {
    setToken(newToken)
    if (newToken) {
      Cookies.set('token', newToken, {expires: 7})
    } else {
      Cookies.remove('token')
    }
  }
  return (
    <AppContext.Provider value = {{
      backendUrl, token, updateToken
    }}>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<DashBoard />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
    </AppContext.Provider>
  )
}

export default App
