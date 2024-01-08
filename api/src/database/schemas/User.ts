
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

const User = model('users', userSchema)

const UserSavedWorkoutsSchema = new Schema({
    userId: String,
    workout: String
})

const UserSavedWorkouts = model('user_saved_workouts', UserSavedWorkoutsSchema)

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

const UserExerciseStats = model('user_exercise_stats', ExerciseStatsSchema)

export { User, UserSavedWorkouts, UserExerciseStats }