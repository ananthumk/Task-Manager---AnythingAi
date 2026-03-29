import express from 'express'
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js'
import { deleteUser, getAllUsers, getUser } from '../controllers/adminController.js'
const router = express.Router()

router.get('/', authenticate, authorizeRoles('admin'), getAllUsers)
router.get('/:id', authenticate, authorizeRoles('admin'), getUser)
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteUser)

export default router