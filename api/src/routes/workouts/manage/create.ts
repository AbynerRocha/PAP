import { FastifyReply, FastifyRequest } from "fastify"
import { ExerciseData } from "../../../@types/Exercise/Index"
import { Workout } from "../../../database/schemas/Workouts"

const url = '/'
const method = 'POST'

type Request = {
    Body: {
        name: string,
        createdBy: string
        exercises: ExerciseData[]
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    if(!req.body.name || !req.body.createdBy || !req.body.exercises) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { name, createdBy, exercises } = req.body
    
    console.log(exercises)

    const thisWorkoutExists = await Workout.find({ name })

    if(thisWorkoutExists.length > 0) return rep.status(400).send({
        error: 'ALREADY_EXISTS',
        message: `'${name}' já foi registado.`,
        thisWorkoutExists
    })

    const workout = await Workout.create({ name, createdBy, createdAt: new Date(),exercises, saves: 0 })
    .catch((err) => {
        console.log(err);
        return rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento.'})
    })

    console.log(workout)

    return rep.status(201).send({ workoutId: workout._id })
}

export { url, method, handler }
