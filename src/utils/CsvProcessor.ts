
import { TransactionData } from "@/types/TransactionData";
import { categories } from "@/utils/categoriesList";
 
export class CsvProcessor {
    static processData (files: File[]): Promise<TransactionData[]> {
        return new Promise (async (resolve, reject) => {
            try {
                if(!files || files.length === 0) {
                    throw new Error("Nenhum arquivo selcionado!");
                }

                const allTransactions: TransactionData[] = [];
                
                for(const file of files) {
                    const fileData = await this.readFile(file);
                    const processedData = this.parseContent(fileData);
                    const transactions = this.mappingData(processedData);

                    allTransactions.push(...transactions);
                }

                if(allTransactions) {
                    resolve(allTransactions);
                } else {
                    resolve([]);
                }
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

    private static mappingData(data: Record<string, string>[]): TransactionData[] {
        function setCategory(description: string): string {
            if (!description) return "Indefinido";

            const text = description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            


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

}