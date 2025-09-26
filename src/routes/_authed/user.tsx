import { Button } from '@/components/ui/button';
import { authClient } from '@/auth/client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/user')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { session, user } = Route.useRouteContext();
  return (
    <div className="h-svh grid place-items-center">
      <h1>User </h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <div className="mt-4 flex gap-x-4">
        <Button
          onClick={async () => {
            await authClient.signOut();
            setTimeout(() => {
              router.invalidate();
            }, 0);
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
