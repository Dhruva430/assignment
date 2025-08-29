import z from 'zod';

export const RequestOtpSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

export type RequestOtpDto = z.infer<typeof RequestOtpSchema>;
