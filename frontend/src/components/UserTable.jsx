import { Trash ,PencilLine } from 'lucide-react';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import axios from 'axios';

const UserTable = ({ users, setChanges }) => {

  const { backendUrl, token } = useContext(AppContext)
  
  const handleDelete = async (id) => {

        const confirmDelete = window.confirm('Are you sure you want to delete this user?')

        if (!confirmDelete) return
        try {
            const response = await axios.delete(`${backendUrl}/api/v1/admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
            if (response.status === 200) {
                alert('User deleted successfully')
                setChanges(prev => prev + 1)
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user')
        }
    }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm text-left bg-transparent">
        
        {/* Table Head */}
        <thead>
          <tr className="border-b border-gray-300">
            <th className="p-3">SI No</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {users.map((user, index) => (
            <tr 
              key={user._id} 
              className="border-b border-gray-200 hover:bg-white/10"
            >
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 capitalize">{user.role}</td>
              <td onClick={() => handleDelete(user._id)} className="p-3 mx-auto flex items-center gap-2">
                <span><Trash className='w-4 h-4' /> </span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default UserTable