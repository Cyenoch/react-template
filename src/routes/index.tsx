import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/auth/client';
import { toast } from 'sonner';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({ to: '/user' });
    }
  },
});

const signInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

function RouteComponent() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: signIn } = useMutation({
    mutationFn: async (values: z.infer<typeof signInFormSchema>) => {
      const { data, error } = await authClient.signIn.email(values);
      if (error) {
        throw error;
      }
      return data;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success('Signed in successfully');
      router.invalidate();
    },
  });

  const { mutate: signUp } = useMutation({
    mutationFn: async (values: z.infer<typeof signInFormSchema>) => {
      const { data, error } = await authClient.signUp.email({
        ...values,
        name: values.email,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success('Signed up successfully');
      router.invalidate();
    },
  });

  return (
    <div className="min-h-svh grid place-items-center">
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle>
            <h1>Sign In</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => signIn(values))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your email to sign in.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your password to sign in.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>

              <Button
                className="mx-auto block"
                variant="link"
                onClick={() => {
                  signUp(form.getValues());
                }}
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
