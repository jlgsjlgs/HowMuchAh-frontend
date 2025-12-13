import { z } from 'zod';

/**
 * Schema for sending an invitation
 */
export const sendInvitationSchema = z.object({
  invitedEmail: z
    .email()
});

export type SendInvitationFormData = z.infer<typeof sendInvitationSchema>;