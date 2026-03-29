import User from "../models/authModels.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Generate Token 
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION || '7d' })
}

// Create new user
export const register = async (req, res) => {
    try {
        const { email, name, password, role = 'user' } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            console.log('User already exists')
            return res.status(409).json({ message: 'User already exists' })
        }

        // Hashing Password
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email,
            name,
            role,
            password: hashedPassword
        })

        const token = generateToken({ id: user._id, role: user.role })

        res.status(201).json({ message: 'User created successfully!' }, token, user)

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Try again later' })
        console.log('Error at register user: ', error.message)
    }
}

// User Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Checking password
        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(402).json({ message: 'Invalid credentials' })
        }

        const token = generateToken({ id: user._id, role: user.role })

        const userObj = user.toObject();
        delete userObj.password;


        res.status(200).json({
            message: 'User logged In successfully!',
            token,
            user: userObj
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Try again later' })
        console.log('Error at logging user: ', error.message)
    }
}