import axiosClient from '@/lib/axios';
import type { PagedExpenseResponse, ExpenseDetailResponse } from './types';

export const expenseQueries = {
  // GET /api/expenses?groupId={groupId}&page=0&size=20&sort=expenseDate,desc - Get all expenses for a group
  getByGroup: async (
    groupId: string,
    page: number = 0,
    size: number = 20,
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<PagedExpenseResponse> => {
    const { data } = await axiosClient.get('/api/expenses', {
      params: {
        groupId,
        page,
        size,
        sort: `${sortField},${sortDirection}`,
      },
    });
    return data;
  },

  // GET /api/expenses/{expenseId} - Get details for a specific expense
  getById: async (expenseId: string): Promise<ExpenseDetailResponse> => {
    const { data } = await axiosClient.get(`/api/expenses/${expenseId}`);
    return data;
  },

  // GET /api/expenses/{groupId}/unsettled - Get number of unsettled expenses for a group
  getUnsettledCount: async (groupId: string): Promise<number> => {
    const { data } = await axiosClient.get(`/api/expenses/${groupId}/unsettled`);
    return data;
  }
};