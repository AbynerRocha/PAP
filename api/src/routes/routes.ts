import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { join } from "path";
import fs from 'fs'

async function Users(app: FastifyInstance, _opts: FastifyPluginOptions, done: any) {
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

async function Tokens(app: FastifyInstance, _opts: FastifyPluginOptions, done: any) {
    const path = join(__dirname, 'tokens')
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

async function Exercises(app: FastifyInstance, _opts: FastifyPluginOptions, done: any) {
    const path = join(__dirname, 'exercises')
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

export { Users, Tokens, Exercises }