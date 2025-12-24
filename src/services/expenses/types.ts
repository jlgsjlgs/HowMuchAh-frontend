export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  totalAmount: number;
  currency: string;
  category: string;
  expenseDate: string;
  paidByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseResponse {
  id: string;
  groupId: string;
  description: string;
  totalAmount: number;
  currency: string;
  category: string;
  expenseDate: string; // ISO date string
  paidByName: string;
  splitCount: number;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  settled: boolean;
}

export interface PagedExpenseResponse {
  content: ExpenseResponse[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ExpenseSplitResponse {
  id: string;
  user: UserSummary;
  amountOwed: number;
  isSettled: boolean;
}

export interface ExpenseDetailResponse {
  id: string;
  groupId: string;
  description: string;
  totalAmount: number;
  currency: string;
  category: string;
  expenseDate: string; // ISO date string
  paidBy: UserSummary;
  splits: ExpenseSplitResponse[];
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface ExpenseSplitDto {
  userId: string;
  amountOwed: number;
}

export interface ExpenseCreationRequest {
  groupId: string;
  description: string;
  totalAmount: number;
  currency: string;
  paidByUserId: string;
  category: string;
  expenseDate?: string; // ISO date string (YYYY-MM-DD)
  splits: ExpenseSplitDto[];
}

export interface ExpenseUpdateRequest {
  description: string;
  totalAmount: number;
  currency: string;
  paidByUserId: string;
  category: string;
  expenseDate: string; // ISO date string (YYYY-MM-DD), required for updates
  splits: ExpenseSplitDto[];
}