import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const signInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be 4 characters or more'),
});

const signUpSchema = signInSchema.extend({
  name: z
    .string()
    .min(1, 'Please enter your name')
    .refine((val) => val !== 'admin', {
      message: 'Nice try! Choose a different username',
    }),
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({ to: '/user' });
    }
  },
});

function SignInForm() {
  const router = useRouter();

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: signIn } = useMutation({
    mutationFn: async (values: SignInData) => {
      const { data, error } = await authClient.signIn.email(values);
      if (error) {
        throw error;
      }
      return data;
    },
    onError(error) {
      toast.error('Sign in failed', {
        description: error.message,
      });
    },
    onSuccess() {
      toast.success('Signed in successfully', {
        description: 'Welcome back!',
      });
      router.invalidate();
    },
  });

  const onSubmit = (data: SignInData) => {
    signIn(data);
  };

  return (
    <form
      className="w-full space-y-4"
      onSubmit={signInForm.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <Controller
          name="email"
          control={signInForm.control}
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="Enter your email"
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="password"
          control={signInForm.control}
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="Enter your password"
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          disabled={signInForm.formState.isSubmitting}
        >
          {signInForm.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
}

function SignUpForm() {
  const router = useRouter();

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { mutate: signUp } = useMutation({
    mutationFn: async (values: SignUpData) => {
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    onError(error) {
      toast.error('Sign up failed', {
        description: error.message,
      });
    },
    onSuccess() {
      toast.success('Signed up successfully', {
        description: 'Welcome!',
      });
      router.invalidate();
    },
  });

  const onSubmit = (data: SignUpData) => {
    signUp(data);
  };

  return (
    <form
      className="w-full space-y-4"
      onSubmit={signUpForm.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <Controller
          name="name"
          control={signUpForm.control}
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                {...field}
                id="name"
                placeholder="Enter your name"
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="email"
          control={signUpForm.control}
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email *</Label>
              <Input
                {...field}
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="password"
          control={signUpForm.control}
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password *</Label>
              <Input
                {...field}
                id="signup-password"
                type="password"
                placeholder="Enter your password"
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          disabled={signUpForm.formState.isSubmitting}
        >
          {signUpForm.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </div>
    </form>
  );
}

function RouteComponent() {
  return (
    <div className="min-h-svh grid place-items-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in" className="mt-6">
              <SignInForm />
            </TabsContent>
            <TabsContent value="sign-up" className="mt-6">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
