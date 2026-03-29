import { PencilLine, Trash } from 'lucide-react'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import AppContext from '../context/AppContext'
import axios from 'axios'

const Card = ({ task, setEditTask, setUpdatedData, setChanges }) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const { backendUrl, token } = useContext(AppContext)

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm('Are you sure you want to delete this task?')

        if (!confirmDelete) return
        setIsDeleting(true)
        try {
            const response = await axios.delete(`${backendUrl}/api/v1/task/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                alert('Task deleted successfully')
                setChanges(prev => prev + 1)
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete task')
        } finally {
            setIsDeleting(false)
        }
    }

    const onEdit = () => {
        setEditTask(true)
        setUpdatedData(task)
    }
    return (
        <div key={task._id} className="sm:max-w-[340px] flex flex-col gap-2 bg-white rounded py-2 px-4">
            <div className="flex w-full justify-between items-center">
                <h3 className="text-[14px] sm:text-[15px]">{task.title}</h3>
                <div className="flex items-center gap-2">
                    <PencilLine onClick={onEdit} className="w-4 h-4 cursor-pointer hover:text-blue-600" />
                    <Trash onClick={() => { handleDelete(task._id) }} disabled={isDeleting} className="w-4 h-4 hover:text-red-600 cursor-pointer" />
                </div>
            </div>
            <p className="text-[11px]">{task.description}</p>
            <div className="flex items-center justify-between">
                <div className={`py-0.5 px-1.5 ${task.priority?.toLowerCase() === 'high' ? 'bg-red-200' : task.priority?.toLowerCase() === 'medium' ? 'bg-yellow-200' : 'bg-green-300'} rounded-md`}>
                    <p className="text-[10px] capitalize">{task.priority}</p>
                </div>
                <p className={`text-[11px] capitalize ${task.status?.toLowerCase() === 'open' ? 'text-red-500' : task.status?.toLowerCase() === 'in progress' ? 'text-blue-600' : 'text-green-500'}`}>{task.status}</p>
            </div>



        </div>
    )
}

export default Card
