"use client"
import Chart from "@/components/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, CheckIcon, DollarSign, Percent, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ProcessedData } from "@/types/processedData";
import { formatValue } from "@/utils/formatValue"
import  PizzaChart from "@/components/pizzaChart";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Header } from "@/components/header";

export default function App() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [showAlert, setShowAlert ] = useState<boolean>(false);
  
  useEffect(() => {
    const dataFromStorage = localStorage.getItem("data");
    try{
      const parsedData = dataFromStorage && JSON.parse(dataFromStorage);
      setData(parsedData);
      setShowAlert(true);
    } catch (e) {
      console.log("erro no parse", e);
    }
  }, [])

  return data ? (
    <main className="h-full sm:ml-14 p-4 bg-white text-[#6B6A3A]">
      <Header />
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4 mt-4">
        <Card className="back">
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-white select-none">Saldo Total</CardTitle>
              <DollarSign className="ml-auto w-4 h-4" />
            </div>
            <CardDescription className="text-white font-light">
              saldo total no período
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className={`text-base sm:text-lg font-bold ${data.dashboard.balance > 0 ? 'text-green-200' : 'text-red-200'}`}>{formatValue(data.dashboard.balance)}</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent">
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
            <p className="text-base sm:text-lg font-bold">{data.dashboard.transactionsCount < 0 ? 0 : data.dashboard.transactionsCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent">
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
            <p className="text-green-700 sm:text-lg font-bold">{formatValue(data.dashboard.totalIncome)}</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent">
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
            <p className="text-red-700 sm:text-lg font-bold">{formatValue(data.dashboard.totalExpenses)}</p>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col sm:flex-row mt-4 gap-4">
        <Chart data={data.barChartData} />
        <PizzaChart data={data.pizzaChartData} />
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
    <div className="ml-0 sm:ml-14 flex flex-col justify-center items-center max-w-full overflow-x-hidden">
      <div className="text-center">Nenhum dado para mostrar :(</div>
    </div>
  )
}