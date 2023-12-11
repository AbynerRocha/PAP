import { ExerciseData } from "../@types/Exercise"

export default function calcWorkoutDifficulty(exercises: ExerciseData[]) {
    let difficulty = 0

    for (const exercise of exercises) {
        difficulty = difficulty + exercise.difficulty
    }

    difficulty = Math.floor(difficulty / exercises.length + 1)

    return difficulty
}