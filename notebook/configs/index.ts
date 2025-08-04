import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const configSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
  GMAIL: z.email(),
  GMAIL_PASSWORD: z.string(),
});

export default configSchema.parse(process.env);
