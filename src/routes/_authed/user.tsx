import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/user')({
  component: RouteComponent,
});

function RouteComponent() {
  const session = authClient.useSession();
  return (
    <div className="h-svh grid place-items-center">
      <h1>User </h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Button
        onClick={() => {
          authClient.signOut();
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
