import { z } from 'zod';

/**
 * Schema for sending an invitation
 */
export const sendInvitationSchema = z.object({
  invitedEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim()
    .refine(
      (email) => email.endsWith('@gmail.com'),
      { message: 'Only Gmail addresses are allowed' }
    ),
});

export type SendInvitationFormData = z.infer<typeof sendInvitationSchema>;