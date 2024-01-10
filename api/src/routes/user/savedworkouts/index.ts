import { FastifyReply, FastifyRequest } from "fastify"
import { UserSavedWorkouts } from "../../../database/schemas/User"
import { Workout } from "../../../database/schemas/Workouts"

const url = '/saved-workouts'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string
        wid?: string
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

    if(req.query.wid) {
        const { wid: workoutId } = req.query
        const savedWorkout = await UserSavedWorkouts.findOne({ userId, workout: workoutId })

        if(!savedWorkout) return rep.status(404).send({
            error: 'NOT_FOUND',
            message: 'Não foi possivel encontrar este treino.'
        })

        const workout = await Workout.findById(savedWorkout.workout)

        return rep.status(200).send({ savedWorkout: { ...savedWorkout, workout } })
    }

    const savedWorkouts = await UserSavedWorkouts.find({ userId })
    
    let data = []

    for(const saved of savedWorkouts) {
        const workout = await Workout.findById(saved.workout)

        data.push({
            ...saved,
            workout
        })
    }

    return rep.status(200).send({ savedWorkouts: data })
}

export { url, method, handler }