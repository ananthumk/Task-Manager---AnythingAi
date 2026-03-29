import React from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    Cookies.remove('token')
    navigate('/login')
  }

  return (
    <div className='bg-[#FEFEFA] py-4 px-10 flex justify-between items-center'>
      <h1 className='text-xl font-bold'>Task Manager</h1>
      <button onClick={handleLogout} className='py-1 px-3 bg-[#555555] text-white rounded-md border-0 outline-0 cursor-pointer'>Logout</button>
    </div>
  )
}

export default Header
