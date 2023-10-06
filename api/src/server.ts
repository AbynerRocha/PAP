import fastify from 'fastify'
import { addUser, getAllUsers } from './controllers/UserController'
import { UserData } from './@types/User'
import './database'
import { Users } from './routes/user'


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
