import { FastifyReply, FastifyRequest } from "fastify"
import { User, UserSavedWorkouts } from "../../../database/schemas/User"
import { Workout } from "../../../database/schemas/Workouts"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '/saved-workouts'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string
        wid?: string
        p?: number
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.query.uid) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    const { uid: userId } = req.query

    if (!userId) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    if (req.query.wid) {
        const { wid: workoutId } = req.query
        const savedWorkout = await UserSavedWorkouts.findOne({ userId, workout: workoutId })

        if (!savedWorkout) return rep.status(404).send({
            error: 'NOT_FOUND',
            message: 'Não foi possivel encontrar este treino.'
        })

        const workout = await Workout.findById(savedWorkout.workout)

        return rep.status(200).send({ savedWorkout: { ...savedWorkout, workout } })
    }

    const page = req.query.p ? req.query.p : 1

    const limit = 25
    const totalWorkouts = await UserSavedWorkouts.countDocuments({ userId })
    const numberOfPages = Math.ceil(totalWorkouts / limit)

    if (page > numberOfPages) return rep.status(400).send({
        error: 'PAGE_NOT_FOUND',
        message: `A página ${page} não existe.`,
        numberOfPages
    })

    const nextPage = page < numberOfPages ? page + 1 : null
    const skipResults = page > 0 ? (page - 1) * limit : 0

    const savedWorkouts = await UserSavedWorkouts.find({ userId }, {}, { skip: skipResults, limit })

    let data = []

    for (const saved of savedWorkouts) {
        const workout = await Workout.findById(saved.workout)
        const creator = await User.findById(workout?.createdBy).select('-password')

        const exercises = []

        for (const exerciseData of workout?.exercises!) {
            const data = await Exercise.findById(exerciseData.exercise)
            exercises.push({ exercise: data, series: exerciseData.series })
        }

        let workoutData = {
            _id: workout?._id,
            name: workout?.name,
            createdAt: workout?.createdAt,
            createdBy: creator,
            saves: workout?.saves,
            lastEdit: workout?.lastEdit,
            exercises
        }

        data.push({
            ...saved,
            workout: workoutData
        })
    }

    return rep.status(200).send({ savedWorkouts: data, nextPage })
}

export { url, method, handler }