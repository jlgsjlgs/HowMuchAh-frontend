import axiosClient from '@/lib/axios';
import type { Invitation } from './types';

export const invitationQueries = {
  // GET /api/invitations/pending - Get pending invitations for current user
  getPending: async (): Promise<Invitation[]> => {
    const { data } = await axiosClient.get('/api/invitations/pending');
    return data;
  },
  
  // GET /api/groups/{groupId}/invitations - Get all invitations for a group (owner view)
  getByGroup: async (groupId: string): Promise<Invitation[]> => {
    const { data } = await axiosClient.get(`/api/groups/${groupId}/invitations`);
    return data;
  },
};