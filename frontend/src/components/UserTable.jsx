import { Trash ,PencilLine } from 'lucide-react';

const UserTable = ({ users }) => {
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
              <td className="p-3 flex items-center gap-2">
                <span><PencilLine className='w-4 h-4' /> </span>
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