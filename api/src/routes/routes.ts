import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { join } from "path";
import fs from 'fs'

type Route = {
    method: HTTPMethods;
    url: string;
    handler: (req: FastifyRequest, rep: FastifyReply) => void;
}

export async function Users(app: FastifyInstance, _opts: FastifyPluginOptions, done: any) {
    const path = join(__dirname, 'user')
    const routes = fs.readdirSync(path)
    
    for (const paths of routes) {
        const routePath = join(path, paths)
        const routeFiles = fs.readdirSync(routePath)

        for(const file of routeFiles) {
            const filePath = join(routePath,file)
            const route = require(filePath)
            
            app.route(route)
        }
    }
}
