type Workout = {
    name: string
    toDate: Date
    exercises: Exercise
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
    Workout,
    Exercise,
    Execution,
    ExerciseRecordUser
}