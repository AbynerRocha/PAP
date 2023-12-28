import { Schema, Types, model } from "mongoose";
import { userSchema } from "./User";
import { ExerciseSchema } from "./Exercises";

export const WorkoutSchema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    createdBy: { type: String, required: true },
    exercises: { type: [{ exercise: String, reps: Number, restTime: Number }], required: true },
    saves: { type: Number, default: 0 },
    lastEdit: { type: Date, default: null }
})

export const Workout = model('workouts', WorkoutSchema)