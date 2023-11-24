import fastify from 'fastify'
import './database'
import routes from './routes/routes'
import dotenv from 'dotenv'
import cors from '@fastify/cors'

dotenv.config()

const server = fastify()

server.register(cors)

server.get('/', async (req, rep) => {
    return rep.status(200).send({ ok: true })
})

routes.map((route) => server.register(route.plugin, { prefix: route.prefix }))

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('[√] Server online ' + address);
})
