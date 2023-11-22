import { Schema, Types, model } from "mongoose";
import { User, userSchema } from "./User";

const ExerciseSchema = new Schema({
    name: { type: String, required: true },
    muscle: { type: String, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    image: { type: String, required: true },
    createdAt: { type: String, default: new Date() },
    createdBy: { type: userSchema, required: true }
})

const Exercise = model('exercises', ExerciseSchema)

export { Exercise }