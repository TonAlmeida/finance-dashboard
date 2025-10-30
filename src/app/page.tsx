"use client"
import Chart from "@/components/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, CheckIcon, DollarSign, Percent, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ProcessedData } from "@/types/processedData";
import { formatValue } from "@/utils/formatValue"
import  PizzaChart from "@/components/pizzaChart";
import FileUpload from "@/components/FileUpload";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";


export default function App() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);

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

    useEffect(() => {
      if (processedData) {
        localStorage.setItem('data', JSON.stringify(processedData));
      if (processedData.transactions.length > 0) {
        setShowAlert(true);
      }

      }
    }, [processedData])

    useEffect(() => {
      console.log(error)
    }, [error])
    
    const handleDataProcessed = (data: ProcessedData) => {
      setProcessedData(data);
      setError('');
    };
  
      const handleError = (errorMessage: string) => {
      setError(errorMessage);
      setProcessedData(null);
    };

  return processedData?.transactions.length && processedData?.transactions.length > 0 ? (
    <main className="sm:ml-14 p-4">
      <div className="flex w-full flex-col sm:flex-row">
        <h1 className="hidden sm:flex p-2 m-2 border-b text-md sm:text-2xl w-full text-left sm:text-center">Risoflora Finance</h1>
        <FileUpload onDataProcessed={handleDataProcessed} onError={handleError} />
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
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
            <p className={`text-base sm:text-lg font-bold ${processedData && processedData?.dashboard.balance > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatValue(processedData?.dashboard.balance || 0)}</p>
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
            <p className="text-base sm:text-lg font-bold">{processedData?.dashboard.transactionsCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-700 select-none">Entradas</CardTitle>
              <Users className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>
              quanto entrou
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-green-700 sm:text-lg font-bold">{formatValue(processedData?.dashboard.totalIncome || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-700 select-none">Saídas</CardTitle>
              <Percent className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>
              quanto saíu
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-red-700 sm:text-lg font-bold">{formatValue(processedData?.dashboard.totalExpenses || 0)}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 flex flex-col md:flex-row gap-4 h-96">
        <Chart data={processedData?.barChartData} />
        <PizzaChart data={processedData?.pizzaChartData ?? []} />
      </section>


      {showAlert && 
        <Drawer open={showAlert} onOpenChange={setShowAlert}>
          <DrawerTrigger></DrawerTrigger>
          <DrawerContent
            style={{ transformOrigin: "top center" }}
          >
            <DrawerHeader>
              <DrawerTitle className="flex justify-center items-center"><CheckIcon />Sucesso!</DrawerTitle>
              <DrawerDescription>Dados carregados corretamente!</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                Fechar
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      }
    </main>
  ) : (
    <div className="ml-14">
      <div className="flex w-full">
        <h1 className="p-2 m-2 border-b text-md sm:text-2xl w-full">Risoflora Finance</h1>
        <FileUpload onDataProcessed={handleDataProcessed} onError={handleError} />
      </div>
      Nenhum dado para mostrar
    </div>
  )
}