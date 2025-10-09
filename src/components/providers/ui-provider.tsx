import { Toaster } from 'sonner';

export function AppUIProvider({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
