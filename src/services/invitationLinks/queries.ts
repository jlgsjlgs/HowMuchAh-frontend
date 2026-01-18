import axiosClient from '@/lib/axios';
import type { InvitationLink, ValidateLinkResponse } from './types';

export const invitationLinkQueries = {
  // GET /api/groups/{groupId}/invitation-links/current - Get or generate current link
  getCurrent: async (groupId: string): Promise<InvitationLink> => {
    const { data } = await axiosClient.get(
      `/api/groups/${groupId}/invitation-links/current`
    );
    return data;
  },
  
  // GET /api/invitation-links/{linkId}/validate - Validate invitation link
  validate: async (linkId: string, token: string): Promise<ValidateLinkResponse> => {
    const { data } = await axiosClient.get(
      `/api/invitation-links/${linkId}/validate`,
      { params: { token } }
    );
    return data;
  },
};