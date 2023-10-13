import * as fs from 'fs'
import path from 'path'
import { Exercise } from '../../database/schemas/Exercises'

type ExerciseData = {
    id: string
    name: string
    level: string
    mechanic: string
    equipment: string
    primaryMuscles: string[]
    secondaryMuscles: string[]
    instructions: string[]
    category: string
    images: string[]
}

export function saveDataFromJSONToDB() {
    const exercisesPath = path.join(__dirname, '../../../data/exercises/')
    const files = fs.readdirSync(exercisesPath).filter((file) => file.includes('.json'))

    for(const file of files) {
        const filePath = path.join(exercisesPath, file)
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
 
        // new Exercise(data).save().catch(console.error)        
    }
}


