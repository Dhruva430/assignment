import z from 'zod';

export const verifyOtpSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  otp: z
    .string()
    .length(6, { message: 'OTP must be exactly 6 characters long' }),
});
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
