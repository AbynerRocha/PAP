import { hashSync } from "bcrypt";
import fastify, { FastifyInstance, FastifyPluginOptions } from "fastify";
import { thisUserExists } from "../controllers/UserController";
import { User } from "../database/schemas/User";

const server = fastify()

export async function Users(app: FastifyInstance, _opts: FastifyPluginOptions, done: any) {
    app.post<{ 
        Body: { 
            name: string
            email: string
            password: string  
        } 
    }>('/register', async (
        req, 
        rep
    ) => {
        const { name, email, password } = req.body

        if(!name || !email || !password) return rep.send({ 
            error: 'MISSING_DATA', 
            message: 'Não foi possivel realizar está ação.', 
            statusCode: 400 
        }).status(400)
        
        const exists = await thisUserExists(null, email)

        if(exists) return rep.send({ 
            error: 'THIS_USER_ALREADY_EXISTS', 
            message: 'Este email já está a ser utilizado.', 
            status: 400 
        }).status(400)


        const hashPassword = hashSync(password, 10)

        const registeredUser = new User({
            name,
            password: hashPassword,
            email,
            accountType: 1,
            createdAt: new Date()
        })

        registeredUser.save()
    })
}