import { TransactionData } from "@/types/TransactionData";
import { expensesCategories, incomeCategories } from "@/utils/categoriesList";

export function NuMappingData(data: Record<string, string>[]): TransactionData[] {
    return data
        .filter(d => d["Data"])
        .map(d => {
            const normalized = Object.fromEntries(
                Object.entries(d).map(([key, value]) => [key.toLowerCase(), value])
            );

            const [day, month, year] = normalized["data"].split("/").map(Number);
            const [type, counterpartName, counterpartDocument] =
                normalized["descrição"].trim().split("-").map(item => item.trim());


            function detectCategory(description: string, categories: Record<string, string[]>): string {
                const normalizedDesc = description.toLowerCase();

                for (const [category, keywords] of Object.entries(categories)) {
                    for (const keyword of keywords) {
                        if (normalizedDesc.includes(keyword.toLowerCase())) {
                            return category;
                        }
                    }
                }

                return "Outros";
            }

        
            function generateCategory() {
                if (+normalized["valor"] > 0) {
                    return detectCategory(normalized["descrição"], incomeCategories);
                } else {
                    return detectCategory(normalized["descrição"], expensesCategories);
                }
            }

            const category = generateCategory();

            return {
                date: new Date(year, month - 1, day),
                value: +normalized["valor"],
                id: normalized["identificador"],
                description: normalized["descrição"],
                category,
                numberOfTransactions: data.length,

                type,
                counterpartName,
                counterpartDocument,
            };
        });
    }