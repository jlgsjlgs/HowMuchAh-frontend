import axiosClient from '@/lib/axios';
import type { SettlementSummary, SettlementDetail } from './types';

export const settlementQueries = {
  // GET /api/settlements/{groupId}/history - Get settlement history for a group
  getHistory: async (groupId: string): Promise<SettlementSummary[]> => {
    const { data } = await axiosClient.get(`/api/settlements/${groupId}/history`);
    return data;
  },

  // GET /api/settlements/{settlementGroupId} - Get details for a specific settlement
  getDetail: async (settlementGroupId: string): Promise<SettlementDetail> => {
    const { data } = await axiosClient.get(`/api/settlements/${settlementGroupId}`);
    return data;
  },
};