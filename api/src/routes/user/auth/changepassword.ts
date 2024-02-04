import { FastifyReply, FastifyRequest } from "fastify"
import { validateLinkToken } from "../../../controllers/Tokens"
import { updateUser } from "../../../controllers/Users"
import { MongooseError } from "mongoose"

const url = '/recovery-pass/c'
const method = 'PUT'

type Request = {
    Querystring: {
        np: string
        atkn: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.query) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    if (!req.query.np) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    if (!req.query.atkn) return rep.status(401).send({
        error: 'MISSING_TOKEN',
        message: 'Não foi possivel realizar esta ação. Tente novamente mais tarde.'
    })


    const { np: password, atkn: token } = req.query

    const validated = await validateLinkToken(token)

    if (validated === null || validated.type !== 'reset-pass') return rep.status(401).send({
        error: 'INVALID_TOKEN',
        message: 'O token expirou. Caso queira trocar a senha, faça um novo pedido.'
    })

    updateUser(validated.data, { password })
    .then((d) => {
        return rep.status(200).send()
    })
        .catch((err: MongooseError) => {
            return rep.status(500).send({
                error: err.name,
                message: 'Não foi possivel realizar esta ação. Tente novamente mais tarde.'
            })
        })
}

export { url, method, handler }