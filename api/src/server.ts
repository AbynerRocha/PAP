import fastify from 'fastify'
import { addUser, getAllUsers } from './controllers/UserController'
import mongoose from 'mongoose'
import { UserData } from './@types/User'

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

server.get('/users', async (req, eep) => {
    return JSON.stringify(getAllUsers())
})


server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    mongoose.connect('mongodb://root:passwd@0.0.0.0:27017/')
        .then(() => {
            console.log("[√] Database connected")
            console.log(`Server listening at ${address}`)

        })
        .catch((err) => {
            console.error("[X] An error occurred when connecting to the database")
            console.error(err);

        })
})
