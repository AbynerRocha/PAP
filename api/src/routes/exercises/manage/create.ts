import { FastifyRequest, FastifyReply } from "fastify"
import { ExerciseData } from "../../../@types/Exercise/Index"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '/create'
const method = 'POST'

type Request = {
    Body: ExerciseData & { createdBy: string }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação'
    })

    const data = req.body

    if(!{...data}) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação'
    })

    const exists = await Exercise.findOne({ name: data.name })

    if(exists) return rep.status(400).send({
        error: 'THIS_EXERCISE_ALREADY_EXISTS',
        message: `Este exercicio '${exists.name}' já existe!`
    })

    Exercise.create(data)
    .then((data) => {
        data.save()

        return rep.status(201).send()
    })
    .catch((err) => {
        return rep.status(500).send({
            error: err.name,
            message: 'Não foi possivel realizar está ação neste momento.'
        })
    })
}

export { method, url, handler }