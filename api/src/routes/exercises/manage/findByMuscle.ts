import { FastifyReply, FastifyRequest } from "fastify"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '/findbymuscle'
const method = 'GET'

type Request = {
    Querystring: {
        muscle: string
        p?: number
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.query.muscle) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação neste momento. Tente novamente mais tarde.'
    })

    const muscle = req.query.muscle.toLowerCase()
    const page = req.query.p ? req.query.p : 1

    const limit = 25
    const totalExercises = await Exercise.countDocuments({ muscle })
    const numberOfPages = Math.ceil(totalExercises / limit)
    
    if (page > numberOfPages) return rep.status(400).send({
        error: 'PAGE_NOT_FOUND',
        message: `A página ${page} não existe.`,
        numberOfPages
    })

    const nextPage = page < numberOfPages ? page + 1 : null
    const skipResults = page > 0 ? (page - 1) * limit : 0

    const exercisesFound = await Exercise.find({ muscle }, {}, { skip: skipResults, limit })

    if (exercisesFound === null) return rep.status(404).send({
        error: 'NOT_FOUND',
        message: 'Não foi possivel encontrar exercícios deste Músculo.'
    })

    return rep.status(200).send({
        exercises: exercisesFound,
        nextPage,
        numberOfPages
    })
}

export { url, method, handler }