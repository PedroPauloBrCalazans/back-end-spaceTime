import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {
    const memorias = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        criado_em: 'asc',
      },
    })
    return memorias.map((memoria) => {
      return {
        id: memoria.id,
        imgVideoUrl: memoria.imagemVideoUrl,
        resumo: memoria.conteudo.substring(0, 115).concat('...'),
      }
    })
  })

  app.get('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memoria = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memoria.publica && memoria.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return memoria
  })

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      conteudo: z.string(),
      imagemVideoUrl: z.string(),
      publica: z.coerce.boolean().default(false),
    })

    const { conteudo, imagemVideoUrl, publica } = bodySchema.parse(request.body)

    const memoria = await prisma.memory.create({
      data: {
        conteudo,
        imagemVideoUrl,
        publica,
        userId: request.user.sub,
      },
    })
    return memoria
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      conteudo: z.string(),
      imagemVideoUrl: z.string(),
      publica: z.coerce.boolean().default(false),
    })

    const { conteudo, imagemVideoUrl, publica } = bodySchema.parse(request.body)

    let memoria = await prisma.memory.findFirstOrThrow({
      where: {
        id,
      },
    })

    if (memoria.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    memoria = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        conteudo,
        imagemVideoUrl,
        publica,
      },
    })
    return memoria
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memoria = await prisma.memory.findFirstOrThrow({
      where: {
        id,
      },
    })

    if (memoria.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
