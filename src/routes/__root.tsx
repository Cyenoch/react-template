import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackQueryDevtools, TanStackRouterDevtools } from '@/components/provider/tanstack-devtools'

interface RootRouteContext {

}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        {' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryDevtools />
    </>
  ),
})
