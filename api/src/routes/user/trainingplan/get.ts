import { FastifyReply, FastifyRequest } from "fastify"
import { UserTrainingPlan } from "../../../database/schemas/User"
import WorkoutController from "../../../controllers/Workout"
import WorkoutData from "../../../@types/Workout"
import { UserTrainingPlanData } from "../../../@types/User"

const url = '/training-plan'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string,
        pid: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.query.uid) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })

    const { uid: userId } = req.query

    if (req.query.pid) {
        const planData = await UserTrainingPlan.findOne({ _id: req.query.pid, user: userId })

        if (planData === null) return rep.status(404).send({ error: 'NOT_FOUND', message: 'Não foi possivel encontrar este plano de treino.' })

        let data = []

        for (const value of planData.plan) {
            if (!value.workout) {
                data.push({
                    restDay: true,
                    workout: null,
                    weekDay: value.weekDay!
                })
                continue
            }

            const workout = await WorkoutController.getById(value.workout)

            data.push({
                restDay: false,
                workout,
                weekDay: value.weekDay!
            })
        }

        return rep.status(200).send({
            plan: {
                _id: planData._id,
                name: planData.name || 'Plano de treino',
                user: planData.user!,
                createdAt: planData.createdAt,
                plan: data
            }
        })
    }

    const plansData = await UserTrainingPlan.find({ user: userId })
        .catch((err) => rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento.' }))

    var planData: UserTrainingPlanData[] = []

    for (const plans of plansData) {
        let data = []
        for (const value of plans.plan) {
            if (!value.workout) {
                data.push({
                    restDay: true,
                    workout: null,
                    weekDay: value.weekDay!
                })
                continue
            }

            const workout = await WorkoutController.getById(value.workout)

            data.push({
                restDay: false,
                workout,
                weekDay: value.weekDay!
            })
        }

        planData.push({
            _id: plans._id,
            name: plans.name || 'Plano de treino',
            user: plans.user!,
            createdAt: plans.createdAt,
            plan: data
        })
    }

    return rep.status(200).send({ plans: planData })
}

export { url, method, handler }