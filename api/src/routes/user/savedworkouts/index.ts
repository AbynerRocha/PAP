import { FastifyReply, FastifyRequest } from "fastify"
import { User, UserSavedWorkouts } from "../../../database/schemas/User"
import { Workout } from "../../../database/schemas/Workouts"
import { Exercise } from "../../../database/schemas/Exercises"
import WorkoutController from "../../../controllers/Workout"

const url = '/saved-workouts'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string
        wid?: string
        p?: number
        li?: number
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

    const page = req.query.p || 1
    const limit = req.query.li || 20
    const total = await UserSavedWorkouts.countDocuments({ userId })
    const numberOfPages = Math.ceil(total / limit)

    if (page > numberOfPages) return rep.status(400).send({
        error: 'PAGE_NOT_FOUND',
        message: `A página ${page} não existe.`,
        numberOfPages
    })

    const nextPage = numberOfPages > page ? page + 1 : null
    const skip = page > 0 ? (page - 1) * limit : 0

    const data = await UserSavedWorkouts.find({ userId }, {}, { skip, limit })
        .catch((err) => rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento' }))

    var savedData = []

    for(const saved of data) {
        const workout = await WorkoutController.getById(saved.workout!)
        const creator = await User.findById(workout?.createdBy).select('-password')

        const exercises = []

        if (!workout?.exercises) continue

        for (const exerciseData of workout?.exercises) {

            const data = await Exercise.findById(exerciseData.exercise)
            exercises.push({ exercise: data, series: exerciseData.series })
        }

        savedData.push({
            _id: saved._id,
            userId,
            workout: {
                ...workout,
                exercises,
                createdBy: creator
            }
        })
    }

    return rep.status(200).send({ savedWorkouts: savedData, nextPage })
}

/*
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
        const workout = await WorkoutController.getById(saved.workout!)
        const creator = await User.findById(workout?.createdBy).select('-password')

        const exercises = []

        for (const exerciseData of workout?.exercises!) {
            const data = await Exercise.findById(exerciseData.exercise)
            exercises.push({ exercise: data, series: exerciseData.series })
        }

        data.push({
            ...saved,
            workout: {
                ...workout,
                exercises,
                createdBy: creator
            }
        })
    }
*/

export { url, method, handler }