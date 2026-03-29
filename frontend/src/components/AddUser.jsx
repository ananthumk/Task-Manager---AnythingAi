import React, { useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../context/AppContext';
import axios from 'axios';
import { X } from 'lucide-react';

const apiStatus = {
  inProgress: 'in_progress',
  loading: 'loading',
  success: 'success',
  failure: 'failure'
};

const AddUser = ({ setAddUser, setChanges }) => {
    const [userInfo, setUserInfo] = useState({
        name: '', email: '', password: '', role: 'user'
    })
    const [msg, setMsg] = useState('')
    const [status, setStatus] = useState(apiStatus.inProgress)

    const timerRef = useRef(null)
    const { backendUrl } = useContext(AppContext)

    // Cleanup timeout on unmount to prevent memory leak
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const handleUserInfo = (e) => {
        const { name, value } = e.target
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMsg('')

        // Validate fields before submitting
        if (!userInfo.name.trim() || !userInfo.email.trim() || !userInfo.password.trim()) {
            setStatus(apiStatus.failure)
            setMsg('All fields are required')
            return
        }

        setStatus(apiStatus.loading)

        try {
            const response = await axios.post(`${backendUrl}/api/v1/auth/register`, userInfo)
            if (response.status === 201) {
                setStatus(apiStatus.success)
                setMsg('User added successfully')
                setChanges(prev => prev + 1)
                timerRef.current = setTimeout(() => {
                    setAddUser(false)
                }, 2000)
            }
        } catch (error) {
            if (error.response) {
                setStatus(apiStatus.failure)
                setMsg(error.response.data.message)
            } else {
                setStatus(apiStatus.failure)
                setMsg(`Network error: ${error.message}`)
            }
        }
    }

    return (
        <div
            className='w-full z-50 min-h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center'
            style={{ zIndex: 2000 }}
        >
            <div className='border-2 min-w-[340px] bg-white border-white flex flex-col gap-3 rounded-md py-6 px-5'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold text-black'>Add User</h2>
                    <X onClick={() => setAddUser(false)} className='w-4 h-4 cursor-pointer' />
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

                    <div className='flex flex-col'>
                        <label className='text-sm text-[#848482] font-semibold'>Name</label>
                        <input
                            name='name'
                            value={userInfo.name}
                            onChange={handleUserInfo}
                            type='text'
                            placeholder='Enter your name'
                            className='border-2 w-full text-sm font-medium border-[#848482] rounded-sm py-1 px-2'
                        />
                    </div>

                    <div className='flex flex-col'>
                        <label className='text-sm text-[#848482] font-semibold'>Email</label>
                        <input
                            name='email'
                            value={userInfo.email}
                            onChange={handleUserInfo}
                            type='email'
                            placeholder='Enter your email'
                            className='border-2 w-full text-sm font-medium border-[#848482] rounded-sm py-1 px-2'
                        />
                    </div>

                    <div className='flex flex-col'>
                        <label className='text-sm text-[#848482] font-semibold'>Password</label>
                        <input
                            name='password'
                            value={userInfo.password}
                            onChange={handleUserInfo}
                            type='password'
                            placeholder='Enter your password'
                            className='border-2 w-full text-sm font-medium border-[#848482] rounded-sm py-1 px-2'
                        />
                    </div>

                    <div className='flex flex-col'>
                        <label className='text-sm text-[#848482] font-semibold'>Role</label>
                        <select
                            name='role'
                            value={userInfo.role}
                            onChange={handleUserInfo}
                            className='border-2 w-full text-sm font-medium border-[#848482] rounded-sm py-1 px-2'
                        >
                            <option value='user' className='text-sm py-1 px-2'>User</option>
                            <option value='admin' className='text-sm py-1 px-2'>Admin</option>
                        </select>
                    </div>

                    <div className='grid grid-cols-2 gap-6'>
                        <button
                            type='submit'
                            disabled={status === apiStatus.loading}
                            className='py-1 px-2 bg-[#4D5D53] hover:bg-[#4d5b5c] disabled:opacity-50 disabled:cursor-not-allowed rounded-md mt-3 text-md font-medium text-white cursor-pointer'
                        >
                            {status === apiStatus.loading ? 'Registering...' : 'Register'}
                        </button>
                        <button
                            type='button'
                            onClick={() => setAddUser(false)}
                            className='py-1 text-[#4D5D53] px-2 bg-transparent border-2 border-[#4D5D53] hover:bg-[#eef3f4] rounded-md mt-3 text-md font-medium cursor-pointer'
                        >
                            Cancel
                        </button>
                    </div>

                </form>

                {msg && (
                    <p className={`text-sm text-center ${status === apiStatus.failure ? 'text-red-500' : 'text-green-500'} font-semibold`}>
                        {msg}
                    </p>
                )}

            </div>
        </div>
    )
}

export default AddUser