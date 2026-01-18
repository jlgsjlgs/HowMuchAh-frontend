import axiosClient from '@/lib/axios';
import type { InvitationLink, ClaimLinkRequest } from './types';
import type { Invitation } from '../invitations/types';

export const invitationLinkMutations = {
  // POST /api/groups/{groupId}/invitation-links/regenerate - Regenerate link
  regenerate: async (groupId: string): Promise<InvitationLink> => {
    const { data } = await axiosClient.post(
      `/api/groups/${groupId}/invitation-links/regenerate`
    );
    return data;
  },
  
  // POST /api/invitation-links/claim - Claim invitation link
  claim: async (request: ClaimLinkRequest): Promise<Invitation> => {
    const { data } = await axiosClient.post(
      '/api/invitation-links/claim',
      request
    );
    return data;
  },
};