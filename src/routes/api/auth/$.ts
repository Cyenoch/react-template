import { getAuthFromContext } from '@/server/middleware/auth'
import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/auth/$')({
  GET: ({ request }) => {
    const auth = getAuthFromContext()
    return auth.handler(request)
  },
  POST: ({ request }) => {
    const auth = getAuthFromContext()
    return auth.handler(request)
  },
})
