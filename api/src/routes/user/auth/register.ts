import { FastifyReply, FastifyRequest } from "fastify"
import { sendEmail } from "../../../controllers/Email"
import { thisUserExists, addUser } from "../../../controllers/Users"
import { getRandomInt } from "../../../utils/randomMinMax"

const method = 'POST'
const url = '/auth/register'

type Request = {
    Body: {
        name: string
        email: string
        password: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
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
        .catch((err) => {
            return rep.status(500).send({ error: err.code, message: 'Não foi possivel realizar o registo neste momento. Tente novamente mais tarde' })
        })

    return rep.status(201).send()
}

export { handler, method, url }