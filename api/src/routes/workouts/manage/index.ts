import { FastifyReply, FastifyRequest } from "fastify"
import { Workout } from "../../../database/schemas/Workouts"
import { User } from "../../../database/schemas/User"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '/'
const method = 'GET'

type Request = {
    Querystring: {
        p: number,
        name?: string
        cb?: string
        id?: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(req.query.id) {
        const workout = await Workout.findById(req.query.id)

        if(workout === null) return rep.status(404).send({
            error: 'NOT_FOUND',
            message: 'Não foi possivel encontrar este treino.'
        })  

        const creator = await User.findById(workout.createdBy)
        const exercises = []

        for(const exerciseData of workout.exercises) {
            const data = await Exercise.findById(exerciseData.exercise)
            exercises.push({ exercise: data, reps: exerciseData.reps, restTime: exerciseData.restTime })
        }

        let workoutData = {
            _id: workout._id,
            name: workout.name,
            createdAt: workout.createdAt,
            createdBy: creator,
            saves: workout.saves,
            lastEdit: workout.lastEdit,
            exercises
        }

        return rep.status(200).send({ workout: workoutData })
    }

    if (!req.query.p) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    let filters = {}

    if (req.query.name) {
        const regex = RegExp(`.*${req.query.name}*.`, 'i')
        filters = { ...filters, name: regex }
    }

    if (req.query.cb) {
        filters = { ...filters, createdBy: req.query.cb }
    }

    const page = req.query.p

    const workouts = await Workout.find(filters, {}, { skip: (page > 1 ? 25 * page : 0), limit: 25 })

    const data = []

    for (const workout of workouts) {
        const creator = await User.findById(workout.createdBy).select('-password')

        const exercises = []

        for(const exerciseData of workout.exercises) {
            const data = await Exercise.findById(exerciseData.exercise)
            exercises.push({ exercise: data, reps: exerciseData.reps, restTime: exerciseData.restTime })
        }

        let workoutData = {
            _id: workout._id,
            name: workout.name,
            createdAt: workout.createdAt,
            createdBy: creator,
            saves: workout.saves,
            lastEdit: workout.lastEdit,
            exercises
        }

        data.push(workoutData)
    }

    return rep.status(200).send({ workouts: data })
}

export { url, method, handler }
