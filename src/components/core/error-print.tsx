import type { ErrorComponentProps } from '@tanstack/react-router';
import { VITE_META_DEV } from '@/constants';
import {Card, CardHeader, CardBody, Button} from '@heroui/react'

function ErrorPrint({ error, reset }: ErrorComponentProps) {
  useEffect(() => {
    console.error('ErrorPrint', error);
  }, [error]);

  return (
    <div className="min-h-svh grid place-items-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
            <h1>Something went wrong</h1>
            An unexpected error occurred. The error has been reported and we're
            working to fix it.
        </CardHeader>
        <CardBody className="space-y-4">
          {VITE_META_DEV && error && (
            <details className="text-sm bg-muted p-4 rounded-md">
              <summary className="cursor-pointer font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs">
                {error.message}
              </pre>
              {error.stack && (
                <pre className="mt-2 whitespace-pre-wrap text-xs opacity-70">
                  {error.stack}
                </pre>
              )}
            </details>
          )}
          <div className="flex gap-2">
            <Button onPress={reset} variant="bordered">
              Try Again
            </Button>
            <Button onPress={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ErrorPrint;
