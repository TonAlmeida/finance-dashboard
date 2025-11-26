import { TransactionData } from "@/types/TransactionData";
import { NuMappingData } from "./NuMappingData";
import { BBMappingData } from "./BbMappingData";

type Params = {
    files: File[],
    bank: string,
}
 
export class CsvProcessor {
    static async processData ({files, bank}: Params): Promise<TransactionData[]> {
        return new Promise (async (resolve, reject) => {
            try {
                if(!files || files.length === 0) {
                    throw new Error("Nenhum arquivo selcionado!");
                }

                const allTransactions: TransactionData[] = [];
                
                for(const file of files) {
                    const fileData = await this.readFile(file);
                    const processedData = this.parseContent(fileData);
                    let transactions: TransactionData[] = [];

                    switch(bank) {
                        case 'nu':
                            transactions = NuMappingData(processedData);
                            break;
                        case 'bb':
                            transactions = BBMappingData(processedData);
                            break;
                        case 'bradesco':
                            console.log("banco do bradesco selecionado")
                            break;
                        default:
                            console.log("error trying make mapping on data");
                            break;
                    }

                    if(transactions) allTransactions.push(...transactions);
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

    


}