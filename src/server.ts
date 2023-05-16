import fastify from 'fastify'

const app = fastify()

app.get('/teste', () => {
  return 'Olá'
})

app.listen({ port: 7474 }).then(() => {
  console.log('🚀 HTTP server running on http://localhost:7474')
})
