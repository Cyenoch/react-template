import { delay } from '@/lib/utils/delay'
import { createServerFn } from '@tanstack/react-start'
import { appMiddlewares } from '../middleware/global'

export const hello = createServerFn().middleware(appMiddlewares).handler(async ({ context }) => {
  await delay(1000)
  return {
    user: await context.user(),
    session: await context.session(),
  }
})
