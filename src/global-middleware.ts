import type { AnyMiddleware } from '@tanstack/react-start'
import { registerGlobalMiddleware } from '@tanstack/react-start'
import { appMiddlewares } from './server/middleware/global'

registerGlobalMiddleware({
  middleware: appMiddlewares as unknown as AnyMiddleware[],
})
