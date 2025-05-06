import { Button } from '@/components/ui/button'
import { hello } from '@/server/function/hello'
import { createFileRoute } from '@tanstack/react-router'
import Heart from '~icons/mingcute/heart-line'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-dvh grid place-items-center">
      <div className="grid gap-y-4 place-items-center">
        <h1>
          Hello "/"!
        </h1>

        <Button onClick={() => hello()}>
          <Heart />
          Hello Button
        </Button>
      </div>
    </div>
  )
}
