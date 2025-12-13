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
    .trim(),
});

export type SendInvitationFormData = z.infer<typeof sendInvitationSchema>;