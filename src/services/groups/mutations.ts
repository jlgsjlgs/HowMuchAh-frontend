import axiosClient from '@/lib/axios';
import type { Group, CreateGroupRequest, UpdateGroupRequest } from './types';

export const groupMutations = {
  // POST /api/groups - Create group
  create: async (request: CreateGroupRequest): Promise<Group> => {
    const { data } = await axiosClient.post('/api/groups', request);
    return data;
  },
  
  // PATCH /api/groups/{groupId} - Change group name / description
  update: async (groupId: string, request: UpdateGroupRequest): Promise<Group> => {
    const { data } = await axiosClient.patch(`/api/groups/${groupId}`, request);
    return data;
  },
  
  // DELETE /api/groups/{groupId} - Delete group
  delete: async (groupId: string): Promise<void> => {
    await axiosClient.delete(`/api/groups/${groupId}`);
  },

  // DELETE /api/groups/{groupId}/members/{userId} - Remove member
  removeMember: async (groupId: string, userId: string): Promise<void> => {
    await axiosClient.delete(`/api/groups/${groupId}/members/${userId}`);
  },
  
  // POST /api/groups/{groupId}/leave - Leave group
  leave: async (groupId: string): Promise<void> => {
    await axiosClient.post(`/api/groups/${groupId}/leave`);
  },
};