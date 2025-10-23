"use client"

import Transactions from "@/components/transactions";
import { ProcessedData } from "@/types/processedData";
import { useEffect, useState } from "react";

export default function Orders() {

    const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
    const [error, setError] = useState<string>('');

    const handleDataProcessed = (data: ProcessedData) => {
        setProcessedData(data);
        setError('');
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
        setProcessedData(null);
    };

    useEffect(() => {
        const storedData = localStorage.getItem("data");
        if (storedData) {
          try {
            setProcessedData(JSON.parse(storedData));
          } catch (e) {
            console.error("Erro ao parsear o localStorage", e);
          }
        }
      }, []);

    return (
        <main className="sm:ml-14">
            <Transactions data={processedData?.transactions}/>
        </main>
    )
}