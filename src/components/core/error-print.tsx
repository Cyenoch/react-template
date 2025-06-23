import type { ErrorComponentProps } from '@tanstack/react-router';
import { ErrorComponent } from '@tanstack/react-router';

function ErrorPrint({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

export default ErrorPrint;
