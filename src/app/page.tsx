"use client"
import Header from "@/components/header";
import Chart from "@/components/chart";
import Transactions from "@/components/transactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, DollarSign, Percent, Users } from "lucide-react";
import { useState } from "react";
import { ProcessedData } from "@/types/processedData";
import { formatValue } from "@/utils/formatValue"

export default function app() {

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

  return (
    <main className="sm:ml-14 p-4">
      <div className="hidden sm:flex w-full">
        <Header
          onDataProcessed={handleDataProcessed}
          onError={handleError}
        />
      </div>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-700 select-none">Saldo Total</CardTitle>
              <DollarSign className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>
              saldo total no período
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className={`text-base sm:text-lg font-bold ${processedData && processedData?.dashboard.balance > 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {formatValue(processedData?.dashboard.balance || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-700 select-none">Transações</CardTitle>
              <BadgeDollarSign className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>
              total de transações no período
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-base sm:text-lg font-bold">{processedData?.dashboard.transactionCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-700 select-none">Entradas</CardTitle>
              <Users className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>
              quanto entrou na conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-green-700 sm:text-lg font-bold">R$ {formatValue(processedData?.dashboard.totalIncome || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-700 select-none">Saídas</CardTitle>
              <Percent className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>
              quanto saíu da conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-red-700 sm:text-lg font-bold">{formatValue(processedData?.dashboard.totalExpenses || 0)}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 flex flex-col md:flex-row gap-4">
        <Chart data={processedData?.chartData} />
        <Transactions data={processedData?.transactions}/>
      </section>
    </main>
  )
}