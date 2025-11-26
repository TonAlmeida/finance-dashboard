import { TransactionData } from "@/types/TransactionData";
import { expensesCategories, incomeCategories } from "@/utils/categoriesList";

export function BBMappingData(data: Record<string, string>[]): TransactionData[] {
    return data
        .filter(d =>
            d["Data"] &&
            d["Data"] !== "00/00/0000" &&
            d["Lançamento"] !== "Saldo Anterior" &&
            d["Lançamento"] !== "Saldo do dia"
        )
        .map(d => {
            const normalized = Object.fromEntries(
                Object.entries(d).map(([key, value]) => [
                    key.toLowerCase(),
                    value?.toString().trim() ?? ""
                ])
            );

            /** --------------------
             *  DATA
             -------------------- */
            const [day, month, year] = normalized["data"].split("/").map(Number);
            const date = new Date(year, month - 1, day);

            /** --------------------
             *  VALOR (formato BB)
             -------------------- */
            const rawValue = normalized["valor"]
                .replace(/\./g, "")
                .replace(",", ".");
            const value = parseFloat(rawValue) || 0;

            /** --------------------
             *  DESCRIÇÃO PADRONIZADA
             *  (igual ao Nubank: string única)
             -------------------- */
            const description = [
                normalized["lançamento"] || "",
                normalized["detalhes"] || ""
            ]
                .filter(Boolean)
                .join(" - ");

            /** --------------------
             *  CATEGORY
             -------------------- */
            function detectCategory(description: string, categories: Record<string, string[]>): string {
                const desc = description.toLowerCase();

                for (const [category, keywords] of Object.entries(categories)) {
                    for (const keyword of keywords) {
                        if (desc.includes(keyword.toLowerCase())) {
                            return category;
                        }
                    }
                }

                return "Outros";
            }

            const category =
                value > 0
                    ? detectCategory(description, incomeCategories)
                    : detectCategory(description, expensesCategories);

            /** --------------------
             *  SIMULA O PADRÃO DO NUBANK
             -------------------- */

            // O BB NÃO traz esses dados.
            // Para não quebrar sua UI, retorno strings vazias.
            const type = normalized["tipo lançamento"] || ""; 
            const counterpartName = "";
            const counterpartDocument = "";

            return {
                date,
                value,
                id: normalized["n° documento"] || "", // BB não fornece ID único
                description,
                category,
                numberOfTransactions: data.length,

                // Mantém compatibilidade com Nubank
                type,
                counterpartName,
                counterpartDocument,
            };
        });
}
