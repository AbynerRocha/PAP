import { FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { compareSync } from "bcrypt";
import { generateAuthToken, generateRefreshToken } from "../../../controllers/Tokens";
import { thisUserExists } from "../../../controllers/Users";
import { User } from "../../../database/schemas/User";

const method = 'POST'
const url = '/auth/login'

async function handler(req: FastifyRequest<{ Body: { email: string; password: string } }>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    const { email, password } = req.body

    if (!email || !password) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar está ação.'
    })

    const exists = await thisUserExists(null, email)
    const userTryingLogin = await User.findOne({ email })

    if (!exists || userTryingLogin === null) return rep.status(404).send({
        error: 'USER_NOT_FOUND',
        message: 'Utilizador inexistente'
    })

    if (!compareSync(password, userTryingLogin.password)) return rep.status(401).send({
        error: 'WRONG_PASSWORD',
        message: 'Senha incorreta.'
    })

    const authToken = generateAuthToken(userTryingLogin.id, userTryingLogin.accountType)
    const refreshToken = generateRefreshToken(userTryingLogin.id)

    return rep.status(200).send({
        user: userTryingLogin,
        refreshToken,
        authToken
    })
}

export { url, method, handler }