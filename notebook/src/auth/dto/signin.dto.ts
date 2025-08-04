import z from 'zod';

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type SigninDto = z.infer<typeof signinSchema>;
