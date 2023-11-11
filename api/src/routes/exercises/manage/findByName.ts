import { FastifyReply, FastifyRequest } from "fastify"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '/findbyname' 
const method = 'GET'

type Request = {
    Querystring: {
        name: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.query.name) return rep.status(400).send({ 
        error: 'MISSING_DATA', 
        message: 'Não foi possivel realizar está ação neste momento. Tente novamente mais tarde.'
    })

    const { name } = req.query

    const regexName = RegExp(`.*${name}.*`, 'i')

    const exercisesFound = await Exercise.find({ name: regexName })

    if(exercisesFound === null) return rep.status(404).send({
        error: 'NOT_FOUND',
        message: 'Não foi possivel encontrar exercícios com este nome.'
    })

    return rep.status(200).send({
        exercises: exercisesFound  
    })
}

export { url, method, handler }