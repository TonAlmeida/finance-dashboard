
import { DashboardData } from "@/types/dashboardData";
import { NuTransactionData } from "@/types/NuTransactionData";
import { ProcessedData } from "@/types/processedData";
import { PizzaChartData } from "@/types/pizzaChartData";
import { BarChartData } from "@/types/barChartData";

export class NuCsvProcessor {
    static processData (files: File[]): Promise<ProcessedData> {
        return new Promise (async (resolve, reject) => {
            try {
                if(!files || files.length === 0) {
                    throw new Error("Nenhum arquivo selcionado!");
                }

                const allTransactions: NuTransactionData[] = [];
                
                for(const file of files) {
                    //gerando NuTransactionData
                    const fileData = await this.readFile(file);
                    const processedData = this.parseContent(fileData);
                    const transactions = this.mappingData(processedData);
                    allTransactions.push(...transactions);
                }

                //gerando ChartData
                const barChartData = this.generateBarChartData(allTransactions);
                const pizzaChartData = this.generatePizzaChartData(allTransactions);

                //gerando dashboardData
                const dashboard = this.generateDashboardData(allTransactions);

                resolve({
                        dashboard,
                        barChartData,
                        pizzaChartData,
                        transactions: allTransactions
                });
            } catch(e) {
                alert("erro de processamento" + e)
                console.log("deu erro no processamento" + e);
                reject(e);
            }
        })
    }

    private static readFile(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject(new Error('Erro ao ler arquivo: ' + file.name));
            reader.readAsText(file, 'UTF-8');
        })
    }

    private static parseContent(content: string) {
        const lines: string[] = content.split("\n");
        const headers = lines[0].split(',').map(header => header.trim());
        const result: Record<string, string>[] = [];
        
        for(let i = 1; i < lines.length; i++) {
            const campos = lines[i].split(",");
            if (campos.every(c => c.trim() === "")) continue;
            const current: Record<string, string> = {}
            for(let j = 0; j < campos.length; j++) {
                current[headers[j]] = campos[j];
            }
            result.push(current);
        }
        return result;
    }

    private static mappingData(data: Record<string, string>[]): NuTransactionData[] {
        function setCategory(description: string): string {
            if (!description) return "Indefinido";

            const text = description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const categories: Record<string, string[]> = {
                "Tabacaria": [
                    "tabacaria", "vape", "narguile", "fumo", "cigarro", "hookah", "charuto", "cachimbo",
                    "essência", "vaporizador", "smoke shop", "tobacco", "fumo eletrônico", "cigarros"
                ],
                "Mercado": [
                    "mercado", "supermercado", "carrefour", "extra", "atacadao", "hiper", "pão de açúcar", "bompreço",
                    "mercantil", "minimercado", "h&b", "zonamix", "bazaar", "super", "conveniência"
                ],
                "Restaurante": [
                    "restaurante", "lanchonete", "burguer", "pizzaria", "bk", "mcdonald", "ifood", "food", "delivery",
                    "fast food", "pizza", "hamburguer", "sanduiche", "comida", "jantar", "almoço", "lanche"
                ],
                "Transporte": [
                    "uber", "99", "cabify", "onibus", "metrô", "metro", "trem", "lotação", "ônibus", "taxi", "rodoviária",
                    "bilhete", "transporte", "passagem", "combustível transporte", "vias"
                ],
                "Entretenimento": [
                    "cinema", "netflix", "spotify", "ingresso", "show", "evento", "teatro", "musical", "livraria",
                    "game", "jogos", "associação cultural", "assinatura", "streaming", "ingressos", "cinematográfica"
                ],
                "Farmácia": [
                    "farmacia", "droga", "raia", "pacheco", "panvel", "medicamento", "remédio", "drogaria", 
                    "saúde", "saúde +", "botica", "ortopedia", "dermatologia"
                ],
                "Posto": [
                    "posto", "gasolina", "diesel", "etanol", "combustível", "gas", "fuel", "bomba", "posto de gasolina",
                    "abastecimento", "carburante", "lubrificante", "óleo"
                ],
                "Vestuário": [
                    "roupa", "moda", "sapato", "renner", "riachuelo", "cea", "vestido", "camisa", "calça", "blusa",
                    "tênis", "boné", "casaco", "jeans", "moda feminina", "moda masculina", "acessório", "bolsa"
                ],
                "Tecnologia": [
                    "apple", "google", "amazon", "eletronico", "celular", "notebook", "tablet", "pc", "computador",
                    "smartphone", "hardware", "software", "tecnologia", "gadgets", "smartwatch", "monitor",
                    "impressora", "periférico"
                ],
                "Educação": [
                    "curso", "faculdade", "escola", "ead", "universidade", "ensino", "professor", "educação", "instituto",
                    "academia", "seminário", "treinamento", "curso online", "ensino superior", "aperfeiçoamento",
                    "formação"
                ],
                "Saúde": [
                    "clinica", "hospital", "dentista", "exame", "laboratorio", "saúde", "checkup", "psicólogo", "nutricionista",
                    "oftalmologista", "ortopedista", "ginecologista", "fisioterapia", "atendimento médico",
                    "urgência", "pronto socorro"
                ],
                "Outros": [
                    "taxa", "serviço", "assinatura", "doação", "presente", "cartão", "boleto", "multas", "imposto", 
                    "diversos", "misc", "comissão", "frete", "correios", "pagamento", "transferência", "transfer", 
                    "depósito", "recarga", "outros"
                ]
            };


            for (const [category, keywords] of Object.entries(categories)) {
                if (keywords.some(keyword => text.includes(keyword))) return category;
            }

            return "Outros";
        }

        return data
            .filter(d => d["Data"]) // ignora linhas sem data
            .map(d => {
                const normalized = Object.fromEntries(
                    Object.entries(d).map(([key, value]) => [key.toLowerCase(), value])
                );

                const [day, month, year] = normalized["data"].split("/").map(Number);
                const [type, counterpartName, counterpartDocument ] = normalized["descrição"].trim().split("-").map(item => item.trim());

                return {
                    date: new Date(year, month - 1, day),
                    value: +normalized["valor"],
                    id: normalized["identificador"],
                    description: normalized["descrição"],
                    category: setCategory(normalized["descrição"]),
                    numberOfTransactions: data.length,

                    type,
                    counterpartName,
                    counterpartDocument,
                };
        });
    }


    private static generateBarChartData(transactions: NuTransactionData[]): BarChartData[] {
        const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

        const summary = new Map<number, { income: number; expenses: number }>();

        for (const t of transactions) {
            const monthIndex = t.date.getMonth(); // 0 = janeiro, 11 = dezembro

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

    private static generatePizzaChartData(transactions: NuTransactionData[]): PizzaChartData[] {
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

    private static generateDashboardData(transactions: NuTransactionData[]): DashboardData {
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

        return {
            balance,
            totalIncome,
            totalExpenses,
            transactionsCount: transactions.length -1,
        }
    }
}