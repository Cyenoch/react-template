import React from 'react';
import * as Sentry from '@sentry/tanstackstart-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-svh grid place-items-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-destructive">
            Something went wrong
          </CardTitle>
          <CardDescription>
            An unexpected error occurred. The error has been reported and we're
            working to fix it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {import.meta.env.DEV && error && (
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
            <Button onClick={resetError} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for functional components
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: Record<string, any>) => {
    Sentry.captureException(error, {
      extra: errorInfo,
    });
  }, []);
}

// Sentry-wrapped error boundary
export const SentryErrorBoundary = Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: ({ error, resetError }) => (
    <DefaultErrorFallback
      error={error instanceof Error ? error : new Error(String(error))}
      resetError={resetError}
    />
  ),
  beforeCapture: (scope, error, errorInfo) => {
    scope.setContext('errorBoundary', {
      componentStack:
        typeof errorInfo === 'string'
          ? errorInfo
          : (errorInfo as any).componentStack,
    });
  },
});
