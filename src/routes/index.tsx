import React from 'react';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authClient } from '@/auth/client';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Input,
  Tabs,
  Tab,
  CardHeader,
} from '@heroui/react';

const signInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z
    .string()
    .min(4, 'Password must be 4 characters or more')
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
      addToast({
        title: 'Sign in failed',
        description: error.message,
        color: 'danger',
      });
    },
    onSuccess() {
      addToast({
        title: 'Signed in successfully',
        description: 'Welcome back!',
        color: 'success',
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
            <Input
              {...field}
              isRequired
              type="email"
              label="Email"
              labelPlacement="outside"
              placeholder="Enter your email"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={signInForm.control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              isRequired
              type="password"
              label="Password"
              labelPlacement="outside"
              placeholder="Enter your password"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />

        <Button
          className="w-full"
          color="primary"
          type="submit"
          isLoading={signInForm.formState.isSubmitting}
        >
          Sign In
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
      addToast({
        title: 'Sign up failed',
        description: error.message,
        color: 'danger',
      });
    },
    onSuccess() {
      addToast({
        title: 'Signed up successfully',
        description: 'Welcome! ',
        color: 'success',
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
            <Input
              {...field}
              isRequired
              label="Name"
              labelPlacement="outside"
              placeholder="Enter your name"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={signUpForm.control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              isRequired
              type="email"
              label="Email"
              labelPlacement="outside"
              placeholder="Enter your email"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={signUpForm.control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              isRequired
              type="password"
              label="Password"
              labelPlacement="outside"
              placeholder="Enter your password"
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />

        <Button
          className="w-full"
          color="primary"
          type="submit"
          isLoading={signUpForm.formState.isSubmitting}
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
}

function RouteComponent() {
  return (
    <div className="min-h-svh grid place-items-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h1 className="text-2xl font-bold">Authentication</h1>
        </CardHeader>
        <CardBody>
          <Tabs aria-label="Authentication Tabs">
            <Tab key="sign-in" title="Sign In">
              <SignInForm />
            </Tab>
            <Tab key="sign-up" title="Sign Up">
              <SignUpForm />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
