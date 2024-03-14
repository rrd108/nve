import { PrismaClient, Link } from '@prisma/client'
import GeneralLink from '~/interfaces/GeneralLink'

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const data = await readBody(event)

  console.log('******* api/links *******')
  console.log({ data })
  console.log('************************')

  const changed: string[] = []
  let item = { id: 0 }
  const promises = data.map(async (link: GeneralLink) => {
    if (link.type == 'link') {
      item = await prisma.link.update({ where: { id: link.id }, data: { position: link.position }, select: { id: true } })
      changed.push(`l${item.id}`)
    }
    if (link.type == 'menu') {
      item = await prisma.menu.update({ where: { id: link.id }, data: { position: link.position }, select: { id: true } })
      changed.push(`m${item.id}`)
    }
  })

  await Promise.all(promises)
  return changed
})
