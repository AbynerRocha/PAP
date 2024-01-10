
import { Schema, model } from 'mongoose'
import { UserData } from '../../@types/User'
import { WorkoutSchema } from './Workouts'

export const userSchema = new Schema<UserData>({
    name: { type: String, required: true }, 
    email: { type: String, required: true }, 
    password: { type: String },
    avatar: { type: String, required: false },
    accessLevel: { type: Number, required: true, default: 1 },
    createdAt: { type: Date, defualt: Date.now() },
    verified: { type: Boolean, default: false },
    emailCode: { type: String }
})

const UserSavedWorkoutsSchema = new Schema({
    userId: String,
    workout: String
})

const ExerciseStatsSchema = new Schema({
    userId: String,
    data: {
        type: [{
            exercise: String,
            stats: [{
                date: { type: Date, default: new Date() },
                reps: Number,
                weight: Number
            }]
        }]
    }
})

const UserWorkoutsHistorySchema = new Schema({
    user: String,
    workout: String,
    date: { type: Date, default: new Date() }
})

const User = model('users', userSchema)
const UserExerciseStats = model('user_exercise_stats', ExerciseStatsSchema)
const UserSavedWorkouts = model('user_saved_workouts', UserSavedWorkoutsSchema)
const UserWorkoutsHistory = model('user_workouts_history', UserWorkoutsHistorySchema)

export { User, UserSavedWorkouts, UserExerciseStats, UserWorkoutsHistory }