
import { Schema, model } from 'mongoose'
import { UserData } from '../../@types/User'

const userSchema = new Schema<UserData>({
    name: { type: String, required: true }, 
    email: { type: String, required: true }, 
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    accessLevel: { type: Number, required: true, default: 1 },
    createdAt: { type: Date, defualt: Date.now() },
    verified: { type: Boolean, default: false },
    emailCode: { type: String }
})

const User = model('users', userSchema)

export { User }