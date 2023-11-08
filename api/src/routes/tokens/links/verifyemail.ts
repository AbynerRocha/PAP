import { FastifyRequest, FastifyReply } from "fastify";
import { validateLinkToken } from "../../../controllers/Tokens";
import { User } from "../../../database/schemas/User";

const method = 'POST'
const url = '/link/v-email'

type Request = {
    Body: {
        token: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    const { token } = req.body

    if(!token) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    const result = await validateLinkToken(token)
    if(result === null) return rep.status(401).send({ error: 'TOKEN_EXPIRED', message: 'Não foi possivel realizar está ação. (Token expirado)' })

    const user = await User.findById(result.data)

    return rep.status(200).send({ 
        userId: user?._id,
        code: user?.emailCode
    })
}   

export { method, url, handler }