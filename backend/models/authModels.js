import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true, unique: true, lowercase: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    password: {type: String, required: true, minlength: (6, 'Password should be atleast 6 character long.'), select: false}
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
export default User