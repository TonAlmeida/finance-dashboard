export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string,
  type: string,
  amount: number,
  document: string,
  counterpartName: string,
  transactionMethod: string,
  rawData: string
}