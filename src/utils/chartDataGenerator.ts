import { BarChartData } from "@/types/barChartData";
import { TransactionData } from "@/types/TransactionData";
import { PizzaChartData } from "@/types/pizzaChartData";

    export function generateBarChartData(transactions: TransactionData[]): BarChartData[] {
        const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

        const summary = new Map<number, { income: number; expenses: number }>();

        for (const t of transactions) {
            const date = t.date instanceof Date ? t.date : new Date(t.date);
            const monthIndex = date.getMonth();

            if (!summary.has(monthIndex)) {
                summary.set(monthIndex, { income: 0, expenses: 0 });
            }

            const current = summary.get(monthIndex)!;

            // Considera valores positivos como entrada e negativos como saída
            if (t.value >= 0) {
                current.income += t.value;
            } else {
                current.expenses += Math.abs(t.value);
            }
        }

        // Transforma o Map em um array organizado
        return Array.from(summary.entries()).map(([monthIndex, { income, expenses }]) => ({
            month: months[monthIndex],
            income: +income.toFixed(2),
            expenses: +expenses.toFixed(2),
        }));
    }

    export function generatePizzaChartData(transactions: TransactionData[]): PizzaChartData[] {
        const grup = transactions.reduce((acc, transaction) => {
            const category = transaction.category || "outros";

            if(!acc[category]) {
                acc[category] = 0;
            } 
            
            const val = Number(transaction.value) || 0;
            acc[category] = (acc[category] || 0) + val;
            
            return acc;
        }, {} as Record<string,number>)

        const data = Object.entries(grup).map(([name, value]) => ({
            name,
            value: value < 0 ? Math.abs(value) : value,
        }))

        if (data.length === 0) {
            data.push({ name: "Sem dados", value: 1 });
        }

        return data;
    }