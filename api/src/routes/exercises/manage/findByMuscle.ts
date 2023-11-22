import { FastifyReply, FastifyRequest } from "fastify"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '/findbymuscle' 
const method = 'GET'

type Request = {
    Querystring: {
        muscle: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.query.muscle) return rep.status(400).send({ 
        error: 'MISSING_DATA', 
        message: 'Não foi possivel realizar está ação neste momento. Tente novamente mais tarde.'
    })

    const muscle = req.query.muscle.toLowerCase()

    const exercisesFound = await Exercise.find({ muscle })

    if(exercisesFound === null) return rep.status(404).send({
        error: 'NOT_FOUND',
        message: 'Não foi possivel encontrar exercícios deste Músculo.'
    })

    return rep.status(200).send({
        exercises: exercisesFound  
    })
}

export { url, method, handler }