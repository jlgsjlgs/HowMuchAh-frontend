import axiosClient from '@/lib/axios';
import type { SettlementDetail } from './types';

export const settlementMutations = {
  // POST /api/settlements/{groupId}/settle - Execute settlement for a group
  executeSettlement: async (groupId: string): Promise<SettlementDetail> => {
    const { data } = await axiosClient.post(`/api/settlements/${groupId}/settle`);
    return data;
  },
};