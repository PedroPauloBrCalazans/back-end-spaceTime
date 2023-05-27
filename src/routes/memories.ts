import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memorias = await prisma.memory.findMany({
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

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memoria = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

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
        userId: 'b8639e92-f368-4e67-887b-60ced8745962',
      },
    })
    return memoria
  })

  app.put('/memories/:id', async (request) => {
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

    const memoria = await prisma.memory.update({
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

  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
