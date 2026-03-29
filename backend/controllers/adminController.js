import User from "../models/authModels.js"

// Get All User
export const getAllUsers = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query 

        const offset = (page - 1) * limit

       
        const whereCondition = search
            ? { name: { $regex: search, $options: 'i' } }
            : {}

        const total = await User.countDocuments(whereCondition)
        const users = await User.find(whereCondition)
            .limit(parseInt(limit))
            .skip(parseInt(offset))

        res.status(200).json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            users
        })

    } catch (error) {
        console.log('Get all user: ', error.message)
        res.status(500).json({ message: 'Something went wrong! try again later' })
    }
}

// Get User by id
export const getUser = async (req, res) => {
    try {
        const {id} = req.params 
        const user = User.findById(id)
        
        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        res.status(200).json(user)
    } catch (error) {
        console.log('Error at get user by id: ', error.message)
        res.status(500).json({message: 'Something went wrong! try again later'})
    }
}

// Delete user by id 
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id) 

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User deleted successfully!' })
    } catch (error) {
        console.log('Error at deleting user: ', error.message)
        res.status(500).json({ message: 'Something went wrong! try again later' })
    }
}