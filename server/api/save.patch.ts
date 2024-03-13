import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const data = await readBody(event)

  const link = await prisma.link.update({ where: { id: data.id }, data })
  return link
})
