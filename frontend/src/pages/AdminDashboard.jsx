import React from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { useContext } from 'react'
import AppContext from '../context/AppContext'
import { useState } from 'react'
import { useEffect } from 'react'
import UserTable from '../components/UserTable'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import AddUser from '../components/AddUser'
import { Oval } from 'react-loader-spinner'
import Cookies from 'js-cookie'

const apiStatus = {
  inProgress: 'in_progress',
  loading: 'loading',
  success: 'success',
  failure: 'failure'
};

const AdminDashboard = () => {
  const [users, setUser] = useState([])
  const [status, setStatus] = useState('')
  const [addUser, setAddUser] = useState(false)
  const [msg, setMsg] = useState('')
  const [changes, setChanges] = useState(0)
  const [page, setPage] = useState(1) 
  const [totalPages, setTotalPages] = useState(1)

  const { backendUrl, token } = useContext(AppContext)

  useEffect(() => {
    setStatus(apiStatus.loading)
  }, [])

  const fetchUsersData = async () => {
    setStatus(apiStatus.inProgress)
    const authToken = token || Cookies.get('token')
    try {
      const response = await axios.get(`${backendUrl}/api/v1/admin/`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }, params: { page }
      })
      
      console.log(response)
      if (response.status === 200) {
        
        setUser(response.data.users)
        setTotalPages(response.data.totalPages) 
        setStatus(apiStatus.success)
      }
    } catch (error) {
      
      setStatus(apiStatus.failure)
      setMsg(error.response.data.message)
    }
  }

  useEffect(() => {
    fetchUsersData()
  }, [backendUrl, token, changes, page])

  return (
    <>
      <div className='bg-[#F5F5DC] min-h-screen w-full'>
        <Header />

        <div className='w-[80%] mx-auto mt-5'>
          <h1 className='text-lg text-black'>List of users</h1>

          {(status === 'loading' || status === 'in_progress') && <div className="w-full flex justify-center items-center mt-20">
            <Oval
              height={50}
              width={50}
              color="#4fa94d"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>}

          {(status === 'success' && users.length > 0) && <div>
            <UserTable users={users} setChanges={setChanges} />
          </div>}

          {(status === 'success' && users.length === 0) && <div className='flex flex-col items-center justify-center min-h-[350px]'>
            <h2 className='text-xl text-black font-semibold'>No user to show</h2>
          </div>}

          {status === 'failure' && <div className='w-full flex flex-col justify-center items-center min-h-[350px]'>
               <p className='text-md'>{msg}</p>
               <button onClick={() => {fetchUsersData()}} className='bg-[#848482] text-black py-1.5 px-4'>Retry</button>
            </div>}

        </div>

        {(status === 'success' && totalPages > 1) && (
            <div className="flex justify-center items-center gap-3 mt-8 mb-6">
              <button
                onClick={() => setPage(prev => prev - 1)}
                disabled={page === 1}
                className="px-4 py-1.5 text-sm rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className='w-4 h-4' />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1.5 text-sm rounded border ${page === i + 1 ? 'text-black' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={page === totalPages}
                className="px-4 py-1.5 text-sm rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          )}

        <div onClick={() => setAddUser(true)} style={{ zIndex: addUser ? 0 : 1000 }} className="w-10 h-10 cursor-pointer fixed bottom-3 md:bottom-10 right-3 md:right-12 flex justify-center items-center rounded-full bg-blue-800 hover:bg-blue-900">
          <Plus className="w-5 h-5 text-white" />
        </div>

      </div>

      {addUser && <AddUser setAddUser={setAddUser} setChanges={setChanges} />}
    </>
  )
}

export default AdminDashboard
