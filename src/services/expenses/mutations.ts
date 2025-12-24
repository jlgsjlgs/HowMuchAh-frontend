import axiosClient from '@/lib/axios';
import type { ExpenseCreationRequest, ExpenseDetailResponse } from './types';

export const expenseMutations = {
  create: async (request: ExpenseCreationRequest): Promise<ExpenseDetailResponse> => {
    const { data } = await axiosClient.post('/api/expenses', request) 
    return data;
  },

  delete: async (expenseId: string): Promise<void> => {
    await axiosClient.delete(`/api/expenses/${expenseId}`);
  }
};