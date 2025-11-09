import { NuTransactionData } from "@/types/NuTransactionData";

export function formatValue(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
export function formatInputValue(value: number): string {
  if (!value || isNaN(value)) return "";
  return value
    .toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(/^0+(?=\d)/, ""); // remove zeros à esquerda
}

export function generateDashboardData(transactions: NuTransactionData[]) {
  const { balance, totalIncome, totalExpenses } = transactions.reduce((acc, transaction) => {
            const value = transaction.value;

            acc.balance += value;

            if (value > 0) {
                acc.totalIncome += value;
            } else {
                acc.totalExpenses += Math.abs(value);
            }


            return acc;
        }, { balance: 0, totalIncome: 0, totalExpenses: 0 })
    return { balance, totalIncome, totalExpenses }
}