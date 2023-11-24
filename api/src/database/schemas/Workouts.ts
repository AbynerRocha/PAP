import { Schema, Types, model } from "mongoose";
import { userSchema } from "./User";
import { ExerciseSchema } from "./Exercises";

export const WorkoutSchema = new Schema({
    name: { type: String, required: true },
    createdBy: { type: userSchema, required: true },
    exercises: { type: Array<typeof ExerciseSchema>, required: true },
    saves: { type: Number, default: 0 }
})

export const Workout = model('workouts', WorkoutSchema)
