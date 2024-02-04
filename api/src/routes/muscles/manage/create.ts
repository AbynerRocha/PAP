import { FastifyReply, FastifyRequest } from "fastify"
import { UserData } from "../../../@types/User"
import { Muscle } from "../../../database/schemas/Muscles"
import { MongooseError } from "mongoose"

export const url = '/'
export const method = 'POST'

type Request = {
    Body: {
        name: string
        createdBy: Omit<UserData, 'password'>
    }
}

export async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento'
    })

    if(!req.body.name || !req.body.createdBy) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento'
    })

    const { name, createdBy } = req.body

    const thisMuscleExists = await Muscle.findOne({ name })

    if(thisMuscleExists !== null) return rep.status(400).send({
        error: 'ALREADY_EXISTS',
        message: 'Este músculo já esta registado.'
    })

    Muscle.create({
        name,
        createdBy,
        createdAt: new Date(),
    })
    .then((data) => {
        data?.save()

        return rep.status(201).send()
    })
    .catch((err: MongooseError) => {
        return rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento' })
    })

}