import { Object, ObjectSchema } from 'realm'
import { UserData } from '../../@types/User'
import { ExerciseInfo } from '../../@types/Workout'
import { BSON } from 'realm/dist/bundle'


class WorkoutSchema extends Object<WorkoutSchema> {
    _id!: string
    name!: string
    saves!: number
    createdAt!: Date
    createdBy!: UserData
    exercises!: ExerciseInfo[]
    lastEdit?: Date

    static schema: ObjectSchema = {
        name: 'workouts',
        properties: {
            _id: 'string',
            name: 'string',
            saves: 'int',
            createdAt: 'Date',
            createdBy: 'UserData',
            exercises: 'ExerciseInfo[]',
            lastEdit: 'Date?'
        },
        primaryKey: '_id'
    }
}

export default WorkoutSchema
