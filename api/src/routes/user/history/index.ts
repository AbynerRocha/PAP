import { FastifyReply, FastifyRequest } from "fastify"
import { UserWorkoutsHistory } from "../../../database/schemas/User"
import { Workout } from "../../../database/schemas/Workouts"
import WorkoutData from "../../../@types/Workout"

const url = '/workout-history'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string
        p?: number
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.query.uid) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { uid: userId } = req.query
    const page = req.query.p ? req.query.p : 1

    const limit = 25
    const totalHistory = await UserWorkoutsHistory.countDocuments({ user: userId })
    const numberOfPages = Math.ceil(totalHistory / limit)
    
    if (page > numberOfPages) return rep.status(400).send({
        error: 'PAGE_NOT_FOUND',
        message: `A página ${page} não existe.`,
        numberOfPages
    })

    const nextPage = page < numberOfPages ? page + 1 : null
    const skipResults = page > 0 ? (page - 1) * limit : 0

    UserWorkoutsHistory.find({
        user: userId
    }, {}, { skip: skipResults, limit })
    .then(async (data) => {
        let history: any[] = []

        for(const value of data) {
            const workout = await Workout.findById(value.workout)
            
            history.push({
                date: new Date(value.date),
                workout
            })
        }

        return rep.status(200).send({ history, nextPage })
    })
    .catch((err) => {
        return rep.status(500).send({
            error: err.name,
            message: 'Não foi possivel realizar esta ação.'
        })
    })

}

export { url, method, handler }