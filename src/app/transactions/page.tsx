"use client"

import { Header } from "@/components/header";
import Transactions from "@/components/transactions";
import { useTransitions } from "@/contexts/transactionsContext";
import { useEffect, useState } from "react";

export default function Orders() {
    const { transactionsData, setTransactionsData } = useTransitions();
    const [error, setError] = useState<string>('');

      useEffect(() => {
        console.log(error)
      }, [error])

    return transactionsData && transactionsData?.length > 0 ? (
        <main className="sm:ml-14 bg-gradient-to-r from-gray-50 to-gray-300">
            <Transactions data={transactionsData}/>
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