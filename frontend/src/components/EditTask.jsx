import axios from 'axios';
import { X } from 'lucide-react';
import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import AppContext from '../context/AppContext';
import { useState } from 'react';

const apiStatus = {
  inProgress: 'in_progress',
  loading: 'loading',
  success: 'success',
  failure: 'failure'
};

const EditTask = ({ setEditTask, setChanges}) => {
  const [status, setStatus] = useState('')
  const [data, setData] = useState(null)
  const [msg, setMsg] = useState('')

  const { backendUrl, token } = useContext(AppContext)

  useEffect(() => {
    setStatus(apiStatus.inProgress)
  }, [])

  const handleClose = () => {
    setEditTask(false)
  }

  const handleChanges = (e) => {
    const { name, value } = e.target 
    setData(prev => ({
        ...prev, 
        [name]: value
    }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setMsg('')
    setStatus(apiStatus.loading)
    try {
        const response = await axios.patch(`${backendUrl}/api/v1/task`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        if(response.status === 200) {
           setMsg('Task Updated')
           setStatus(apiStatus.success)
           setChanges(prev => prev + 1)
        }
    } catch (error) {
        setMsg('Failed to updated task')
        setStatus(apiStatus.failure)
    }
  }

  return (
    <div className="w-full z-50 min-h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
            <div className="bg-white rounded w-[90%] sm:w-[80%] md:min-w-[300px] max-w-[400px] p-3 sm:p-5 flex flex-col justify-center gap-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg sm:text-xl font-bold">Update Task</h1>
                    <X onClick={handleClose} className="w-5 h-5 cursor-pointer hover:text-red-500" />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-light">Task Title</label>
                        <input required name="title" value={data?.title || ''} onChange={handleChanges} type="text" className="w-full text-[13px] py-3 px-6 border border-gray-300 rounded-md" placeholder="Enter task title" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-light">Description</label>
                        <textarea name="description" value={data?.description || ''} onChange={handleChanges} className="w-full text-[13px] py-2 px-6 min-h-[70px] border border-gray-300 rounded-md" placeholder="Enter task description" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-light">Priority</label>
                            <select name="priority" value={data?.priority || ''} onChange={handleChanges} className="p-2 text-[11px] border rounded outline-0 border-gray-300">
                                <option value="low">LOW</option>
                                <option value="medium">MEDIUM</option>
                                <option value="high">HIGH</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-light">Status</label>
                            <select name="status" value={data?.status || ''} onChange={handleChanges} className="p-2 text-[11px] rounded border outline-0 border-gray-300">
                                <option value="pending">PENDING</option>
                                <option value="in progress">IN PROGRESS</option>
                                <option value="completed">COMPLETED</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-light">DueDate</label>
                            <input required name="dueDate" value={data?.dueDate} onChange={handleChanges} type="date"
                             className="p-2 text-[11px] rounded border outline-0 border-gray-300" placeholder="Enter task title" />

                        </div>
                    
                    <div className="grid grid-cols-2 min-h-[30px] gap-6">
                        <button type="submit"className="py-2 text-[13px] bg-blue-600 text-white cursor-pointer rounded hover:bg-blue-700 disabled:bg-gray-400">
                             {status === 'loading' ? 'Updating...' : 'Update Task'}
                        </button>
                        <button type="button" onClick={handleClose} className="py-2 text-[13px] text-gray-900 bg-gray-300 cursor-pointer rounded hover:bg-gray-400">
                             Cancel
                        </button>
                    </div>
                </form>
            </div>
            
        </div>
  )
}

export default EditTask
