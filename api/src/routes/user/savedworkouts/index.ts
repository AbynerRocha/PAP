import { FastifyReply, FastifyRequest } from "fastify"
import { UserSavedWorkouts } from "../../../database/schemas/User"
import { Workout } from "../../../database/schemas/Workouts"

const url = '/savedworkouts'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.query.uid) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    const { uid: userId } = req.query

    if (!userId) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    const workoutsSaved = await UserSavedWorkouts.find({ userId })
    
    let data = []

    for(const workoutSaved of workoutsSaved) {
        const workout = await Workout.findById(workoutSaved.workout)

        data.push({
            ...workoutSaved,
            workout
        })
    }

    return rep.status(200).send({ workoutsSaved: data })
}

export { url, method, handler }