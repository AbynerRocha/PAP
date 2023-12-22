import { ExerciseData } from "../Exercise"
import { UserData } from "../User"

type WorkoutData = {
    _id: string
    name: string
    saves: number
    createdAt: Date
    createdBy: UserData
    exercises: ExerciseInfo[]
    lastEdit?: Date 
}

type ExerciseInfo = { exercise: ExerciseData, reps: number, restTime: number }

type Execution = {
    serie: { 
        reps: number
        weight: number
    }[],
    restTime: number // time
}

type ExerciseRecordUser = {
    PR: number
    weightData: {
        date: Date,
        weight: number
    }[]
}


export {
    WorkoutData,
    ExerciseInfo,
    Execution,
    ExerciseRecordUser
}