import { FastifyReply, FastifyRequest } from "fastify"
import { Muscle } from "../../../database/schemas/Muscles"

export const url = '/'
export const method = 'GET'

type Request = {
    Querystring: {
        name?: string
        p?: number
    }
}

async function findWithName(name: string, page?: number) {
    const regexName = RegExp(`.*${name}.*`, 'i')
    const muscles = await Muscle.find({ name: regexName }, {}, { skip: ( page ? page > 1 ? 10*page : 0 : 0 ), limit: 25 })

    return muscles
}

export async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(req.query.name) {
        const muscles = findWithName(req.query.name, (req.query.p ? req.query.p : undefined))

        if(muscles === null){
            return rep.status(404).send({ error: 'NOT_FOUND', message: 'Não foi possivel encontrar um músculo com este nome.' })
        }

        return rep.status(200).send({ muscles })
    }

    const { p: page } = req.query

    const muscles = await Muscle.find({}, {}, { skip: ( page ? page > 1 ? 10*page : 0 : 0 ), limit: 25 })

    return rep.status(200).send({ muscles })
}