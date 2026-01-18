import { z } from 'zod';

/**
 * Schema for sending an invitation
 */
export const claimInvitationLinkSchema = z.object({
  invitedEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
});

export type claimInvitationLinkFormData = z.infer<typeof claimInvitationLinkSchema>;