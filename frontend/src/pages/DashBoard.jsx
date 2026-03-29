import React, { useContext } from 'react'
import Header from '../components/Header'
import { useState } from 'react';
import { useEffect } from 'react';
import { Oval } from 'react-loader-spinner'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import AppContext from '../context/AppContext';
import axios from 'axios';
import AddTask from '../components/AddTask';
import Card from '../components/Card';
import EditTask from '../components/EditTask';

const apiStatus = {
  inProgress: 'in_progress',
  loading: 'loading',
  success: 'success',
  failure: 'failure'
};

const DashBoard = () => {
  const [status, setStatus] = useState('')
  const [tasks, setTasks] = useState([])
  const [addTask, setAddTask] = useState(false)
  const [editTask, setEditTask] = useState(false)
  const [changes, setChanges] = useState(0)
  const [updateData, setUpdatedData] = useState({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filter, setFilter] = useState({
    status: '', priority: '', search: ''
  })


  const handleFiltering = (e) => {
    const { name, value } = e.target
    setFilter(prev => ({
      ...prev,
      [name]: value
    }))
    setPage(1)
  }

  const { backendUrl, token } = useContext(AppContext)

  useEffect(() => {
    setStatus(apiStatus.loading)
  }, [])

  const fetchTaskData = async () => {
    if (!token) return

    try {
      const response = await axios.get(`${backendUrl}/api/v1/task`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          search: filter.search,
          priority: filter.priority,
          status: filter.status,
          page
        }
      })

      if (response.status === 200) {
        setTasks(response.data.tasks)
        setTotalPages(response.data.totalPages)
        setStatus(apiStatus.success)
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        setStatus(apiStatus.failure)
      } else {
        console.log('Network error:', error.message);
        setStatus(apiStatus.failure)
      }
    }
  }

  useEffect(() => {
    fetchTaskData()
  }, [backendUrl, token, changes, filter, page])

  return (
    <>
      <div className='bg-[#F5F5DC] min-h-screen w-full'>

        <Header />

        <div className='w-[80%] mx-auto my-10'>

          <div className="flex items-center gap-2 flex-wrap sm:gap-5 mx-auto rounded bg-white py-3 px-5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px]">Fliter by Search</label>
              <input type="search" onChange={handleFiltering} name="search" placeholder="Search anything..." className="min-w-[100px] md:min-w-[250px] outline-0 text-[12px] rounded border border-gray-300 py-0.5 px-1 sm:px-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px]">Fliter by Status</label>
              <select name="status" onChange={handleFiltering} className="min-w-[100px] md:min-w-[250px] outline-0 text-[12px] rounded border border-gray-300 py-0.5 px-1 sm:px-2">
                <option value='' className="text-[11px] py-0.5 px-2">All Status</option>
                <option value='pending' className="text-[11px] py-0.5 px-2">Pending</option>
                <option value='in progress' className="text-[11px] py-0.5 px-2">In Progress</option>
                <option value='completed' className="text-[11px] py-0.5 px-2">Completed</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px]">Fliter by Priority</label>
              <select name="priority" onChange={handleFiltering} className="min-w-[100px] md:min-w-[250px] outline-0 text-[12px] rounded border border-gray-300 py-0.5 px-2">
                <option value='' className="text-[11px] py-0.5 px-2">All Priority</option>
                <option value='low' className="text-[11px] py-0.5 px-2">Low</option>
                <option value='medium' className="text-[11px] py-0.5 px-2">Medium</option>
                <option value='high' className="text-[11px] py-0.5 px-2">High</option>
              </select>
            </div>
          </div>

          {status === 'loading' && <div className="w-full flex justify-center items-center mt-20">
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
          </div>
          }

          {(status === 'success' && tasks.length === 0) &&
            <div className="w-full flex flex-col justify-center items-center mt-20 gap-4">
              <p className="text-lg text-gray-600 font-semibold">No tasks found</p>
              <p className="text-sm text-gray-500">Create your first task to get started</p>
              <button
                onClick={() => setAddTask(true)}
                className="px-6 py-2 flex cursor-pointer justify-center items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className='w-4 h-4' /> Create Task
              </button>
            </div>
          }

          {(status === 'success' && tasks.length > 0) &&
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'>
              {tasks?.map(task => (
                <Card task={task} setEditTask={setEditTask} setUpdatedData={setUpdatedData} setChanges={setChanges} />
              ))}
            </div>
          }

           {(status === 'success' ) && (
          <div className="flex justify-center items-center gap-3 mt-8">
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
                className={`px-3 py-1.5 text-sm rounded border ${page === i + 1 ? ' text-black' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page === totalPages}
              className="px-4 py-1.5 text-sm rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowRight className='w-4' />
            </button>
          </div>
        )}



        </div>


        <div onClick={() => setAddTask(true)} style={{ zIndex: 1000 }} className="w-10 h-10 cursor-pointer fixed bottom-3 md:bottom-10 right-3 md:right-12 flex justify-center items-center rounded-full bg-blue-800 hover:bg-blue-900">
          <Plus className="w-5 h-5 text-white" />
        </div>
      </div>
      {addTask && <AddTask setAddTask={setAddTask} setChanges={setChanges} />}
      {editTask && <EditTask setEditTask={setEditTask} setChanges={setChanges} updateData={updateData} />}
    </>
  )
}

export default DashBoard
