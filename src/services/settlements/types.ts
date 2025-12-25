export interface SettlementSummary {
  id: string;
  settledAt: string;
  transactionCount: number;
}

export interface SettlementDetail {
  id: string;
  settledAt: string;
  transactions: SettlementTransaction[];
}

export interface SettlementTransaction {
  payer: UserSummary;
  payee: UserSummary;
  amount: number;
  currency: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
}