import React from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { useContext } from 'react'
import AppContext from '../context/AppContext'
import { useState } from 'react'
import { useEffect } from 'react'
import UserTable from '../components/UserTable'
import { Plus } from 'lucide-react'
import AddUser from '../components/AddUser'
import { Oval } from 'react-loader-spinner'

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

  const { backendUrl, token } = useContext(AppContext)

  useEffect(() => {
    setStatus(apiStatus.loading)
  }, [])

  const fetchUsersData = async () => {
    setStatus(apiStatus.inProgress)
    try {
      const response = await axios.get(`${backendUrl}/api/v1/admin/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 201) {
        console.log(response)
        setUser(response.data.users)
        setStatus(apiStatus.success)
      }
    } catch (error) {
      console.log(error)
      setStatus(apiStatus.failure)
    }
  }

  useEffect(() => {
    fetchUsersData()
  }, [])

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
            <UserTable users={users} />
          </div>}

          {(status === 'success' && users.length === 0) && <div className='flex flex-col items-center justify-center min-h-[350px]'>
            <h2 className='text-xl text-black font-semibold'>No user to show</h2>
          </div>}

        </div>

        <div onClick={() => setAddUser(true)} style={{ zIndex: addUser ? 0 : 1000 }} className="w-10 h-10 cursor-pointer fixed bottom-3 md:bottom-10 right-3 md:right-12 flex justify-center items-center rounded-full bg-blue-800 hover:bg-blue-900">
          <Plus className="w-5 h-5 text-white" />
        </div>

      </div>

      {addUser && <AddUser setAddUser={setAddUser} />}
    </>
  )
}

export default AdminDashboard
