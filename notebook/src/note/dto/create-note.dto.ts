import z from 'zod';

export const createNoteSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Content must not be empty' })
    .max(1000, { message: 'Content must be less than 1000 characters' }),
});

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
