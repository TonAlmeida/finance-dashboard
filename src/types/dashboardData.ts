export interface DashboardData {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  averageTransaction: number;
  topSpendingCategory: string;
  categoryBreakdown: object;
}