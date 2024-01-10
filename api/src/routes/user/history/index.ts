import { FastifyReply, FastifyRequest } from "fastify"
import { UserWorkoutsHistory } from "../../../database/schemas/User"
import { Workout } from "../../../database/schemas/Workouts"
import WorkoutData from "../../../@types/Workout"

const url = '/workout-history'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string
    }
}

function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.query.uid) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { uid: userId } = req.query
    
    UserWorkoutsHistory.find({
        user: userId
    })
    .then(async (data) => {
        let history: any[] = []

        for(const value of data) {
            const workout = await Workout.findById(value.workout)
            
            history.push({
                date: new Date(value.date),
                workout
            })
        }

        return rep.status(200).send({ history })
    })
    .catch((err) => {
        return rep.status(500).send({
            error: err.name,
            message: 'Não foi possivel realizar esta ação.'
        })
    })

}

export { url, method, handler }