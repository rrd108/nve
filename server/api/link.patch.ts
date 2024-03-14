import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const data = await readBody(event)

  console.log('******* api/link *******')
  console.log({ data })
  console.log('************************')

  const link = await prisma.link.update({ where: { id: data.id }, data })
  return link
})
