import { compare, compareSync, hashSync } from "bcrypt";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { addUser, thisUserExists } from "../controllers/Users";
import { User } from "../database/schemas/User";
import { generateAuthToken, generateRefreshToken } from "../controllers/Tokens";

export async function Users(app: FastifyInstance, _opts: FastifyPluginOptions, done: any) {
    app.post<{ 
        Body: { 
            name: string
            email: string
            password: string  
        } 
    }>('/auth/register', async (req, rep) => {
        if(!req.body) return rep.status(400).send({ 
            error: 'MISSING_DATA', 
            message: 'Não foi possivel realizar está ação.'
        })

        const { name, email, password } = req.body

        if(!name || !email || !password) return rep.status(400).send({ 
            error: 'MISSING_DATA', 
            message: 'Não foi possivel realizar está ação.'
        })
        
        const exists = await thisUserExists(null, email)

        if(exists) return rep.status(400).send({ 
            error: 'THIS_USER_ALREADY_EXISTS', 
            message: 'Este email já está a ser utilizado.'
        })

        const registeredUser = await addUser({ 
            name, 
            email, 
            password, 
            accountType: 1, 
            createdAt: new Date() 
        })

        const refreshToken = generateRefreshToken(registeredUser._id)
        const authToken = generateAuthToken(registeredUser._id, registeredUser.accountType)

        return rep.status(201).send({
            user: registeredUser,
            refreshToken,
            authToken
        })
    })

    app.post<{
        Body: {
            email: string
            password: string
        }
    }>('/auth/login', async (req,rep) => {
        if(!req.body) return rep.status(400).send({ 
            error: 'MISSING_DATA', 
            message: 'Não foi possivel realizar está ação.'
        })

        const { email, password } = req.body 

        if(!email || !password) return rep.status(400).send({ 
            error: 'MISSING_DATA', 
            message: 'Não foi possivel realizar está ação.'
        })

        const exists = await thisUserExists(null, email)
        const userTryingLogin = await User.findOne({ email })

        if(!exists || userTryingLogin === null) return rep.status(404).send({ 
            error: 'USER_NOT_FOUND', 
            message: 'Utilizador inexistente'
        })

        if(!compareSync(password, userTryingLogin.password)) return rep.status(401).send({ 
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
    })
}