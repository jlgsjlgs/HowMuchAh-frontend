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
    .trim()
    .refine(
      (email) => email.endsWith('@gmail.com'),
      { message: 'Only Gmail addresses are allowed' }
    ),
});

export type claimInvitationLinkFormData = z.infer<typeof claimInvitationLinkSchema>;