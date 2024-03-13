import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'))

  const menu = await prisma.menu.findUnique({
    where: { id },
    include: { links: true, children: { include: { links: true } } },
  })
  menu.children = [...menu?.children, ...menu?.links]
  delete menu.links
  return menu
})
