import fastify from 'fastify'
import { addUser, getAllUsers } from './controllers/UserController'
import { UserData } from './@types/User'
import './database'


const server = fastify()

server.get('/', async (request, reply) => {
    return 'OK\n'
})

server.get('/add-user', async (req, eep) => {
    const user: UserData = {
        name: 'User 1',
        email: 'teste@evotraining.com',
        password: 'teste',
        accountType: 1,
        createdAt: new Date(),
    }

    const registered = await addUser(user)

    return JSON.stringify(registered)
})

server.get('/users', async (req, rep) => {
    const users = await getAllUsers()
    
    return JSON.stringify(users)
})


server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('[√] Server online ' + address);
    
})
