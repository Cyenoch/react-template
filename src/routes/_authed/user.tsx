import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';

const testFn = createServerFn().handler(async () => {
  return 'test';
});

export const Route = createFileRoute('/_authed/user')({
  component: RouteComponent,
});

function RouteComponent() {
  const { session, user } = Route.useRouteContext();
  return (
    <div className="h-svh grid place-items-center">
      <h1>User </h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <div className="mt-4 flex gap-x-4">
        <Button onClick={() => testFn().then(toast.success)}>Test</Button>

        <Button
          onClick={() => {
            authClient.signOut();
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
