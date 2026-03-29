import axios from 'axios'
import React, { useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import AppContext from '../context/AppContext';

const Login = () => {
    const [userInfo, setUserInfo] = useState({
        email: '', password: ''
    })
    const [errMsg, setErrMsg] = useState(null)

    const { backendUrl, token } = useContext(AppContext)

    const navigate = useNavigate()

    const navigateToRegister = () => {
        setErrMsg(null)
        setUserInfo({ email: '', password: '' })
        navigate('/register')
    }

    const handleUserInfo = (e) => {
        const { name, value } = e.target
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrMsg(null)
        try {
            const url = `${backendUrl}/api/v1/auth/login`
            const response = await axios.post(url, userInfo)
            if (response.status === 200) {
                console.log(response.data)
                Cookies.set('token', response.data.token, { expires: 7 })
                setUserInfo({ email: '', password: '' })
                setErrMsg(null)
                if (response.data.user.role === 'user') {
                    navigate('/')
                } else {
                    navigate('/admin')
                }
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message);
                setErrMsg(error.response.data.message)
            } else {
                console.log('Network error:', error.message);
                setErrMsg(`Network error: ${error.message}`)
            }
        }
    }

    return (
        <div className='bg-[#F5F5DC] min-h-screen w-full flex justify-center items-center'>

            <div className='border-2 min-w-[340px] border-[#555555] flex flex-col gap-3 rounded-md py-6 px-5'>
                <h2 className='text-2xl font-bold text-center text-black'>Welcome Back!</h2>

                <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

                    <div className='flex flex-col'>
                        <label className='text-sm text-[#848482] font-semibold'>Email</label>
                        <input name="email" onChange={handleUserInfo} type='text' placeholder='Enter your email'
                            className='border-2 w-full text-sm font-medium border-[#848482] rounded-sm py-1 px-2' />
                    </div>

                    <div className='flex flex-col'>
                        <label className='text-sm text-[#848482] font-semibold'>Password</label>
                        <input type='password' placeholder='Enter your password' name='password' onChange={handleUserInfo}
                            className='border-2 w-full text-sm font-medium border-[#848482] rounded-sm py-1 px-2' />
                    </div>

                    <button type='submit' className='py-1 px-2 bg-[#4D5D53] hover:bg-[#4d5b5c] rounded-md mt-3 text-md font-medium text-white cursor-pointer'>
                        Login
                    </button>

                    <p className='text-sm text-center text-[#2A3439]'>
                        Don't have a account? <span onClick={navigateToRegister} className='hover:underline cursor-pointer hover:font-medium text-[#6082B6]'>
                            Click here
                        </span>
                    </p>

                </form>

                {errMsg && <p className='text-sm text-center text-red-500 font-semibold'>{errMsg}</p>}

            </div>

        </div>
    )
}

export default Login
