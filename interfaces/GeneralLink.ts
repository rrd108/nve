import type { Link } from '@prisma/client'

export default interface GeneralLink extends Link {
  type: 'link' | 'menu'
  children?: Link[]
  links?: Link[]
}
