import { FastifyReply, FastifyRequest } from "fastify"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '' 
const method = 'GET'

type Request = {
    Querystring: {
        id: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.query.id) return rep.status(400).send({ 
        error: 'MISSING_DATA', 
        message: 'Não foi possivel realizar está ação neste momento. Tente novamente mais tarde.'
    })

    const { id } = req.query

    const exercisesFound = await Exercise.findById(id)

    if(exercisesFound === null) return rep.status(404).send({
        error: 'NOT_FOUND',
        message: 'Não foi possivel encontrar exercícios com este nome.'
    })

    return rep.status(200).send({
        exercise: exercisesFound  
    })
}

export { url, method, handler }