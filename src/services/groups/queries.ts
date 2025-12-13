import axiosClient from '@/lib/axios';
import type { Group, GroupMember } from './types';

export const groupQueries = {
  // GET /api/groups - Get all groups for current user
  getAll: async (): Promise<Group[]> => {
    const { data } = await axiosClient.get('/api/groups');
    return data;
  },

  // GET /api/groups/{groupId}/members - Get all members of a group
  getMembers: async (groupId: string): Promise<GroupMember[]> => {
    const { data } = await axiosClient.get(`/api/groups/${groupId}/members`);
    return data;
  },
};