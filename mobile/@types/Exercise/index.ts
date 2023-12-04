import { MuscleData } from "../Muscle"
import { UserData } from "../User"

export type ExerciseData = {
    _id?: string
    name: string
    muscle: MuscleData
    difficulty: number
    image: string
    createdBy: UserData
}