import { z } from 'zod';
import { VALIDATION } from '@/lib/constants';

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .max(VALIDATION.PASSWORD_MAX_LENGTH, `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`),
});

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .max(VALIDATION.PASSWORD_MAX_LENGTH, `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .max(VALIDATION.PASSWORD_MAX_LENGTH, `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .max(VALIDATION.PASSWORD_MAX_LENGTH, `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
