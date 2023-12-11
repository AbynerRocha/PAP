import { ExerciseData } from "../Exercise"
import { UserData } from "../User"

type WorkoutData = {
    name: string
    saves: number
    createdAt: Date
    createdBy: UserData
    exercises: ExerciseData[]
}

type Exercise = {
    name: string
    date: Date
    weekDay: number   
    execution: Execution
    recordData: ExerciseRecordUser
}

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
    Exercise,
    Execution,
    ExerciseRecordUser
}