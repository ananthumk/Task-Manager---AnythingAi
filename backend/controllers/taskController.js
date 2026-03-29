import Task from "../models/taskModel.js"

// Validate Due Date
const validateDueDate = (dueDate) => {
    const due = new Date(dueDate)
    const today = new Date()

    today.setHours(0, 0, 0, 0)
    return due >= today
}

// Create Task
export const addTask = async (req, res) => {
    try {
        const { title, description, status = 'pending', priority = 'low', dueDate } = req.body



        if (dueDate && !validateDueDate(dueDate)) {
            console.log('POST /api/v1/tasks -> 400 Bad Request (Invalid due date)')
            return res.status(400).json({ message: 'Dur Date cannot be lesss than today' })
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            userId: req.user.id
        })
        
        console.log('POST /api/v1/tasks -> 201 Created')
        res.status(200).json({ message: 'Task created successfully' }, task)
    } catch (error) {
        console.log('Error at add Task: ', error.message)
        return res.status(500).json({ message: 'Something went wrong! Try again later' })
    }
}

// Get All Tasks
export const getAllTasks = async (req, res) => {
    try {
        const { search = '', priority = '', status = '', page } = req.query 
        
        const pageNum = parseInt(page) || 1 
        const limit = 10 
        const skip = (pageNum - 1) * limit 

        const filter = { userId: req.user.id}
        if (status) filter.status = status
        if (priority) filter.priority = priority 

        if (search) {
            filter.$or = [
                { title: {$regex: search, $options: 'i'}},
                { description: {$regex: search, $options: 'i'}}
            ]
        }
        
        const totalTask = await Task.countDocuments(filter)

        
        const tasks = await Task.find(filter)
        .skip(skip).limit(limit).sort({createdAt: -1})


        console.log('GET /api/v1/tasks -> 200 OK')

        res.status(200).json({tasks,
            totalPages: Math.ceil(totalTask / limit),
            currentPage: pageNum,
            totalTask
        })
    } catch (error) {
        console.log('GET /api/tasks -> 500 ERROR:', error.message)
        res.status(500).json({ message: 'Something went wrong! try again later' })
    }
}

// Update Task 
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        // Check dueDate
        if (updates.dueDate && !validateDueDate(updates.dueDate)) {
            console.log(`PUT /api/v1/tasks/${id} -> 400 Bad Request`)
            return res.status(400).json({ message: 'Due date should not be less than today' })  
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            updates,
            {
                returnDocument: 'after', 
                runValidators: true       
            }
        )

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' })
        }
        
        console.log(`PUT /api/v1/tasks/${id} -> 200 OK`)
        res.status(200).json({ message: 'Task updated successfully', updatedTask })

    } catch (error) {
        console.log('Error at update task: ', error.message)
        res.status(500).json({ message: 'Something went wrong! try again later' })
    }
}

// Get Task 
export const getTask = async (req, res) => {
    try {
        const { id } = req.params

        const task = await Task.findOne({
            where: {
                id,
                userId: req.user.id
            }
        })
        if (task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        res.status(200).json(task)
    } catch (error) {
        console.log('Error at get task: ', error.message)
        res.status(500).json({ message: 'Something went wrong! try again later' })
    }
}

// Delete Task 
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params

        const task = await Task.findOneAndDelete({  
            _id: id, userId: req.user.id
        })

        if (!task) {  
            return res.status(404).json({ message: 'Task not found' })
        }
        
        console.log(`DELETE /api/v1/tasks/${id} -> 200 OK`)
        res.status(200).json({ message: 'Task deleted successfully!' })
    } catch (error) {
        console.log('Error at delete task: ', error.message)
        // res.status(500).json({ message: 'Something went wrong! try again later' })
        res.status(500).json({ message: error.message })
    }
}
