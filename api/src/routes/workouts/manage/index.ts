import { FastifyReply, FastifyRequest } from "fastify"
import { Workout } from "../../../database/schemas/Workouts"

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

        return rep.status(200).send({ workout })
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

    return rep.status(200).send({ workouts })
}

export { url, method, handler }
