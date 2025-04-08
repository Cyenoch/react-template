import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>
        Hello "/"!
      </h1>

      <Button>
        Hello Button
      </Button>
    </div>
  )
}
