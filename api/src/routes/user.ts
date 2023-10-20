import { compare, compareSync, hashSync } from "bcrypt";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { addUser, thisUserExists } from "../controllers/Users";
import { User } from "../database/schemas/User";
import { generateAuthToken, generateRefreshToken } from "../controllers/Tokens";
import { sendEmail } from "../controllers/Email";
import { getRandomInt } from "../utils/randomMinMax";

export async function Users(app: FastifyInstance, _opts: FastifyPluginOptions, done: any) {
    app.post<{
        Body: {
            name: string
            email: string
            password: string
        }
    }>('/auth/register', async (req, rep) => {
        if (!req.body) return rep.status(400).send({
            error: 'MISSING_DATA',
            message: 'Não foi possivel realizar está ação.'
        })

        const { name, email, password } = req.body

        if (!name || !email || !password) return rep.status(400).send({
            error: 'MISSING_DATA',
            message: 'Não foi possivel realizar está ação.'
        })

        const exists = await thisUserExists(null, email)

        if (exists) return rep.status(400).send({
            error: 'THIS_USER_ALREADY_EXISTS',
            message: 'Este email já está a ser utilizado.'
        })

        const emailVerifyCode = getRandomInt(11111, 99999)

        addUser({
            name,
            email,
            password,
            accountType: 1,
            createdAt: new Date(),
            verified: false,
            emailCode: emailVerifyCode.toString()

        }).catch((err) => {
            return rep.status(500).send({ error: err.code, message: 'Não foi possivel realizar o registo neste momento. Tente novamente mais tarde' })
        })

        // Send email verification

        sendEmail({
            to: email,
            subject: 'Verifique o seu email',
            html: `<style>h1, p { font-family: Arial; }</style>
            <h1>Olá ${name.includes(' ') ? name.split(' ')[0] : name}</h1>
            <br/>
            <p>
                O seu código de verificação é: <strong>${emailVerifyCode}</strong>
            </p>`
        })
            .then(() => console.log("Resolveu"))
            .catch((err) => {
                return rep.status(500).send({ error: err.code, message: 'Não foi possivel realizar o registo neste momento. Tente novamente mais tarde' })
            })

        return rep.status(201).send()
    })

    app.post<{
        Body: {
            email: string
            password: string
        }
    }>('/auth/login', async (req, rep) => {
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
    })

    app.post<{ 
        Body: { 
            code: string, 
            userId: string 
        } 
    }>('/auth/verify-email', async (req, rep) => {
        if (!req.body) return rep.status(400).send({
            error: 'MISSING_DATA',
            message: 'Não foi possivel realizar está ação.'
        })

        const { userId, code } = req.body

        const user = await User.findById(userId)

        if(!user) return rep.status(404).send({
            error: 'USER_NOT_FOUND',
            message: 'Utilizador inexistente'
        }) 

        if(code !== user.emailCode) return rep.status(400).send({
            error: 'INVALID_CODE',
            message: 'Este código não é válido.'
        })

        User.updateOne({ _id: userId }, { $set: { validate: true, emailCode: "" } })

        return rep.status(200).send()
    })
}