import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(memoriesRoutes)

app.listen({ port: 7474 }).then(() => {
  console.log('🚀 HTTP server running on http://localhost:7474')
})
