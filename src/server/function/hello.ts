import { delay } from '@/lib/utils/delay'
import { createServerFn } from '@tanstack/react-start'
import { appMiddlewares } from '../middleware/global'
import { getLogger } from '../middleware/logger'

export const hello = createServerFn().middleware(appMiddlewares).handler(async ({ context }) => {
  const logger = getLogger()
  logger.info('Ciallo～(∠・ω< )')
  await delay(1000)
  logger.info('Ciallo～(∠・ω< )'.split('').reverse().join(''))
  return {
    user: await context.user(),
    session: await context.session(),
  }
})
