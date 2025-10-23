export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  transferType?: string;
  document?: string;
  counterpartName?: string;
  bank?: string;
  identifier?: string;
}