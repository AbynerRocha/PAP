import { FastifyReply, FastifyRequest } from "fastify"
import { Exercise } from "../../../database/schemas/Exercises"
import { generateAuthToken, validateAuthToken, validateRefreshToken } from "../../../controllers/Tokens"
import { User } from "../../../database/schemas/User"
import { AccessLevel } from "../../../@types/User"
import { Muscle } from "../../../database/schemas/Muscles"

const url = ''
const method = 'GET'

type Request = {
    Querystring: {
        id?: string,
        name?: string,
        muscle?: string
        p: number
    },
    Headers: {
        'auth-token': string
        'refresh-token': string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (req.query.id) {
        const exercise = await Exercise.findById(req.query.id)

        return rep.status(200).send({ exercise })
    }

    if (!req.query.p) return rep.status(400).send({ error: 'MISSING_DATA' })

    const { p: page } = req.query

    let filters = {}

    if (req.query.name) {
        filters = { ...filters, name: RegExp(`.*${req.query.name}.*`, 'i') }
    }

    if (req.query.muscle) {
        filters = { ...filters, muscle: req.query.muscle }
    }

    const exercises = await Exercise.find(filters, {}, { skip: (page > 1 ? 10 * page : 0), limit: 25 })
    const data = []

    for (const exercise of exercises) {
        const creator = await User.findById(exercise.createdBy)
        const muscle = await Muscle.findById(exercise.muscle)


        let exerciseData = {
            _id: exercise._id,
            name: exercise.name,
            difficulty: exercise.difficulty,
            image: exercise.image,
            createdAt: exercise.createdAt,
            muscle,
            createdBy: creator
        }

        data.push(exerciseData)
    }

    return rep.status(200).send({ exercises: data })
}

export { url, method, handler }