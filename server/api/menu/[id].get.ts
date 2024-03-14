import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'))

  const menu = await prisma.menu.findUnique({
    where: { id },
    include: {
      links: true,
      children: { include: { links: { orderBy: { position: 'asc' } } } },
    },
  })
  menu.children = [...menu?.children, ...menu?.links]
    .sort((a, b) => a.position - b.position)
    .map(item => ({
      ...item,
      links: item.links?.map(link => ({ ...link, uid: `${link.id}/${link.position}` })),
      uid: `${item.id}/${item.position}`,
    }))
  delete menu.links
  return menu
})
