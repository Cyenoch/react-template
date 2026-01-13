import { type ErrorComponentProps } from "@tanstack/react-router";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui";
import appCss from "@/index.css?url";

const VITE_META_DEV = import.meta.env.DEV;

function ErrorPrint({ error, reset }: ErrorComponentProps) {
  return (
    <>
      <script>
        {`
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = '${appCss}';
          document.head.appendChild(link);
        `}
      </script>
      <div className="min-h-svh grid place-items-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              An unexpected error occurred. The error has been reported and we're working to fix it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {VITE_META_DEV && error && (
              <details className="text-sm bg-muted p-4 rounded-md">
                <summary className="cursor-pointer font-medium">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs">{error.message}</pre>
                {error.stack && (
                  <pre className="mt-2 whitespace-pre-wrap text-xs opacity-70">{error.stack}</pre>
                )}
              </details>
            )}
            <div className="flex gap-2">
              <Button onClick={reset} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()}>Reload Page</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ErrorPrint;
