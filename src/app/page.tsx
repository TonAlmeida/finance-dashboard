"use client"
import Chart from "@/components/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, CheckIcon, DollarSign, Percent, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { formatValue, generateDashboardData } from "@/utils/formatValue"
import  CategoriesChart from "@/components/categoriesChart";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Header } from "@/components/header";
import { useTransitions } from "@/contexts/transactionsContext";
import { generateBarChartData, generatePizzaChartData } from "@/utils/chartDataGenerator"

export default function App() {
  const { transactionsData, setTransactionsData } = useTransitions();
  const [showAlert, setShowAlert ] = useState<boolean>(false);
  const dashboard = generateDashboardData(transactionsData ?? []);
  const barChartData = generateBarChartData(transactionsData ?? []);
  const pizzaChartData = generatePizzaChartData(transactionsData ?? []);

  useEffect(() => {
    transactionsData && setShowAlert(true);
  }, []);

  return (dashboard && transactionsData && transactionsData?.length > 0) ? (
    <main className="sm:ml-14 p-4 bg-white text-[#6B6A3A] overflow-x-hidden">
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
            <p className={`font-robotoMono sm:text-3xl font-bold ${dashboard.balance > 0 ? 'text-green-200' : 'text-red-200'}`}>{formatValue(dashboard.balance)}</p>
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
            <p className="font-robotoMono sm:text-3xl font-bold">{transactionsData.length < 0 ? 0 : transactionsData.length}</p>
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
            <p className={`text-font-robotoMono sm:text-3xl font-semibold`}>{formatValue(dashboard.totalIncome)}</p>
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
            <p className="texfont-robotoMono sm:text-3xl font-semibold">-{formatValue(dashboard.totalExpenses)}</p>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col sm:flex-row mt-4 gap-4">
        <Chart data={barChartData} />
        <CategoriesChart data={pizzaChartData} />
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
    <main className="ml-0 sm:ml-14">
    <Header />
    <div className="flex flex-col justify-center items-center h-96">
      <h1 className="text-center">Abra o menu na opção Gerar dados <br/> para adicionar :)</h1>
    </div>
    </main>
  )
}