import { Schema, Types, model } from "mongoose";

const ExerciseSchema = new Schema({
    id: String,
    name: String,
    level: String,
    mechanic: String,
    equipment: String,
    primaryMuscles: [String],
    secondaryMuscles: [String],
    instructions: [String],
    category: String,
    images: [String]
})

const Exercise = model('exercises', ExerciseSchema)

export { Exercise }