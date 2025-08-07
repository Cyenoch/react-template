import { z } from 'zod';
import { VALIDATION } from '@/lib/constants';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.enum(['en', 'zh', 'es', 'fr']).default('en'),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
