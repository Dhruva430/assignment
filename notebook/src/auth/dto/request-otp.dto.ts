import z from 'zod';

export const resendOtpSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

export type ResendOtpDto = z.infer<typeof resendOtpSchema>;
