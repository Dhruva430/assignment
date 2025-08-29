import z from 'zod';

export const SetPasswordDto = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});
export type SetPasswordDto = z.infer<typeof SetPasswordDto>;
