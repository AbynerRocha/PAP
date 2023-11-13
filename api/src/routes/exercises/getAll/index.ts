import { FastifyReply, FastifyRequest } from "fastify"
import { Exercise } from "../../../database/schemas/Exercises"
import { generateAuthToken, validateAuthToken, validateRefreshToken } from "../../../controllers/Tokens"
import { User } from "../../../database/schemas/User"
import { AccessLevel } from "../../../@types/User"

const url = '/get-all'
const method = 'GET'

type Request = {
    Querystring: {
        p: number
    },
    Headers: {
        'auth-token': string
        'refresh-token': string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply){
    if(!req.query) return rep.status(400).send({ error: 'MISSING_DATA' })
    // if(!req.headers["auth-token"] || !req.headers["refresh-token"]) return rep.status(403).send({ error: 'MISSING_AUTH' })

    // const authToken = req.headers["auth-token"]
    // const refreshToken = req.headers["refresh-token"]

    // const isAuthTokenValid = await validateAuthToken(authToken)
    // const isRefreshTokenValid = await validateRefreshToken(refreshToken)

    // if(isRefreshTokenValid === null) return rep.status(403).send({
    //     logout: true,
    //     error: 'REFRESH_TOKEN_EXPIRED',
    //     message: 'A sua sessão expirou!'
    // })

    // const userRequesting = await User.findById(isRefreshTokenValid.userId).select('accessLevel')
    // const accessLevel = userRequesting?.accessLevel as AccessLevel
    
    // var newAuthToken
    
    // if(isAuthTokenValid === null) {
    //     newAuthToken = generateAuthToken(isRefreshTokenValid.userId, accessLevel)
    // }
    
    const { p: page } = req.query

    const exercises = await Exercise.find({}, {}, { skip: ( page > 1 ? 10*page : 0 ), limit: 25 })
    
    return   rep.status(200).send({ exercises })
}

export { url, method, handler }