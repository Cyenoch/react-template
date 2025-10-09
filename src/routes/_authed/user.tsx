import { authClient } from '@/lib/auth/client';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/_authed/user')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { session, user } = Route.useRouteContext();

  return (
    <div className="min-h-svh grid place-items-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">User Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                variant="destructive"
                onClick={async () => {
                  await authClient.signOut();
                  setTimeout(() => {
                    router.invalidate();
                  }, 0);
                }}
              >
                Sign Out
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  router.invalidate();
                }}
              >
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
