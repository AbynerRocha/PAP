import fastify from 'fastify'
import './database'
import { Exercises, Tokens, Users } from './routes/routes'
import dotenv from 'dotenv'
import cors from '@fastify/cors'

dotenv.config()

const server = fastify()

server.register(cors)

server.get('/', async (req, rep) => {
    return rep.status(200).send({ ok: true })
})

server.register(Users, { prefix: '/user' })
server.register(Tokens, { prefix: '/token' })
server.register(Exercises, { prefix: '/exercise' })

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('[√] Server online ' + address);
})
