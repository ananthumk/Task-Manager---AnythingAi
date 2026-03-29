import jwt from 'jsonwebtoken'

// Auth Middleware
export const authenticate  = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' })
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()
    } catch (error) {
       console.log('Auth Middleware: ', error.message)
       res.status(401).json({message: 'Invalid or expired token'})
    }

}

// Role Middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            return res.status(403).json({message: 'Access denied'})
        }
        next()
    }
}