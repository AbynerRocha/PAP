import { FastifyReply, FastifyRequest } from "fastify"
import { Muscle } from "../../../database/schemas/Muscles"

export const url = '/'
export const method = 'GET'

type Request = {
    Querystring: {
        name?: string
    }
}

async function findWithName(name: string) {
    const regexName = RegExp(`.*${name}.*`, 'i')
    const exercisesFound = await Muscle.find({ name: regexName })

    return exercisesFound
}

export async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(req.query.name) {
        const muscles = findWithName(req.query.name)

        if(muscles === null){
            return rep.status(404).send({ error: 'NOT_FOUND', message: 'Não foi possivel encontrar um músculo com este nome.' })
        }

        return rep.status(200).send({ muscles })
    }

    const muscles = await Muscle.find()

    return rep.status(200).send({ muscles })
}