import fastify from 'fastify'
import './database'
import { Users } from './routes/user'
import dotenv from 'dotenv'
import { saveDataFromJSONToDB } from './controllers/Exercises'

dotenv.config()

const server = fastify()

server.get('/', async (request, reply) => {
    return 'OK\n'
})

server.register(Users, { prefix: '/user'})

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('[√] Server online ' + address);
})
