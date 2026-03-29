import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { addTask, deleteTask, getAllTasks, getTask, updateTask } from '../controllers/taskController.js'
const router = express.Router()

router.post('/', authenticate, addTask)
router.get('/', authenticate, getAllTasks)
router.get('/:id', authenticate, getTask)
router.patch('/:id', authenticate, updateTask)
router.delete('/:id', authenticate, deleteTask)

export default router