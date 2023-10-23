import fastify from 'fastify'
import './database'
import { Tokens, Users } from './routes/routes'
import dotenv from 'dotenv'

dotenv.config()

const server = fastify()

server.get('/', async (request, reply) => {
    return 'OK\n'
})

server.register(Users, { prefix: '/user'})
server.register(Tokens, { prefix: '/token'})

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('[√] Server online ' + address);
})
