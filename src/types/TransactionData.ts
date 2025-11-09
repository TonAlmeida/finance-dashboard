export type TransactionData = {
    date: Date,
    value: number,
    id: string,
    description: string,

    category: string,
    type: string;
    
    counterpartName: string;
    counterpartDocument?: string;
}