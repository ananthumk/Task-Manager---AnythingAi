import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'

import dotenv from 'dotenv'
import taskRouter from './routes/taskRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import { connectDb } from './db/db.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

connectDb()

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/task', taskRouter)
app.use('/api/v1/admin', adminRouter)

const PORT = process.env.PORT 

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
