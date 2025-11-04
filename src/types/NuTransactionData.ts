export type NuTransactionData = {
    date: Date,
    value: number,
    id: string,
    numberOfTransactions?: number,
    description: string,

    category: string,
    type: string;
    
    counterpartName: string;
    counterpartDocument?: string;
}