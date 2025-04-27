import { getAuth } from '@/server/auth'
import { getDatabaseInstance } from '@/server/database'
import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/auth/$')({
  GET: ({ request }) => {
    const auth = getAuth(getDatabaseInstance())
    return auth.handler(request)
  },
  POST: ({ request }) => {
    const auth = getAuth(getDatabaseInstance())
    return auth.handler(request)
  },
})
