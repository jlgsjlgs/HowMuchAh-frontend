import axiosClient from '@/lib/axios';
import type { Invitation, SendInvitationRequest } from './types';

export const invitationMutations = {
  // POST /api/groups/{groupId}/invitations - Send invitation
  send: async (groupId: string, request: SendInvitationRequest): Promise<Invitation> => {
    const { data } = await axiosClient.post(
      `/api/groups/${groupId}/invitations`, 
      request
    );
    return data;
  },
  
  // POST /api/invitations/{invitationId}/accept - Accept invitation
  accept: async (invitationId: string): Promise<Invitation> => {
    const { data } = await axiosClient.post(
      `/api/invitations/${invitationId}/accept`
    );
    return data;
  },
  
  // POST /api/invitations/{invitationId}/decline - Decline invitation
  decline: async (invitationId: string): Promise<Invitation> => {
    const { data } = await axiosClient.post(
      `/api/invitations/${invitationId}/decline`
    );
    return data;
  },
  
  // POST /api/groups/{groupId}/invitations/{invitationId} - Revoke invitation
  revoke: async (groupId: string, invitationId: string): Promise<void> => {
    await axiosClient.post(
      `/api/groups/${groupId}/invitations/${invitationId}`
    );
  },
};