"use client"

import { Header } from "@/components/header";
import Transactions from "@/components/transactions";
import { ProcessedData } from "@/types/processedData";
import { useEffect, useState } from "react";

export default function Orders() {

    const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const storedData = localStorage.getItem("data");
        if (storedData) {
          try {
            setProcessedData(JSON.parse(storedData));
          } catch (e) {
            console.error("Erro ao parsear o localStorage", e);
            setError("erro ao processar localstorage")
          }
        }
      }, []);

      useEffect(() => {
        console.log(error)
      }, [error])

    return processedData && processedData?.transactions.length > 0 ? (
        <main className="sm:ml-14 bg-gradient-to-r from-gray-50 to-gray-300">
            <Transactions data={processedData?.transactions}/>
        </main>
    ) : (
      <main className="sm:ml-14">
      <Header />
      <section className="sm:ml-14 flex flex-col justify-center items-center h-28">
        <h1>Nenhuma transação encontrada!?</h1>
      </section>
      </main>
    )
}