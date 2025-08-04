import z from 'zod';

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export type SignupDto = z.infer<typeof signupSchema>;
