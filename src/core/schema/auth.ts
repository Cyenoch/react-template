import { z } from "zod";
import { VALIDATION } from "./constants";

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be 4 characters or more"),
});

export const signUpSchema = signInSchema.extend({
  name: z
    .string()
    .min(1, "Please enter your name")
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be ${VALIDATION.NAME_MAX_LENGTH} characters or less`)
    .refine((val) => val !== "admin", {
      message: "Nice try! Choose a different username",
    }),
});

export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
