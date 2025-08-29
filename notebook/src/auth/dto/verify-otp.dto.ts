import z from 'zod';

export const VerifyOtpSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  otp: z
    .string()
    .length(6, { message: 'OTP must be exactly 6 characters long' }),
});
export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;
