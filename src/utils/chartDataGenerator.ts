import { BarChartData } from "@/types/barChartData";
import { TransactionData } from "@/types/TransactionData";
import { PizzaChartData } from "@/types/pizzaChartData";

    export function generateBarChartData(transactions: TransactionData[]): BarChartData[] {
    const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

    // Map onde a chave é "ANO-MÊS"
    const summary = new Map<string, { income: number; expenses: number }>();

    for (const t of transactions) {
        const date = t.date instanceof Date ? t.date : new Date(t.date);

        const year = date.getFullYear();
        const monthIndex = date.getMonth();

        const key = `${year}-${monthIndex}`; // ex: "2024-10"

        if (!summary.has(key)) {
            summary.set(key, { income: 0, expenses: 0 });
        }

        const current = summary.get(key)!;

        if (t.value >= 0) {
            current.income += t.value;
        } else {
            current.expenses += Math.abs(t.value);
        }
    }

    // Transforma o Map em um array para o gráfico
    const result: BarChartData[] = [...summary.entries()].map(([key, data]) => {
        const [yearStr, monthStr] = key.split("-");
        const monthIndex = Number(monthStr);

        return {
            label: `${months[monthIndex]}/${yearStr}`,
            income: data.income,
            expenses: data.expenses,
            month: monthIndex,
            year: Number(yearStr)
        };
    });

    // Ordena por ano e mês (opcional, mas recomendado)
    result.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });

    return result;
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