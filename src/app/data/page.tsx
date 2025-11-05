"use client"
import { Controller, Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { categories } from "@/utils/categoriesList";
import React, { useEffect, useState } from "react";
import { ProcessedData } from "@/types/processedData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Header } from "@/components/header";
import { DashboardData } from "@/types/dashboardData";
import { formatValue, formatInputValue } from "@/utils/formatValue";
import { transactionSchema } from "@/utils/transactionSchema";
import { CheckCircle2Icon } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { NuTransactionData } from "@/types/NuTransactionData";

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function Data() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const defaultDashboardData: DashboardData = {
      balance: 0,
      totalExpenses: 0,
      totalIncome: 0,
      transactionsCount: 0
    }
  const dashboard: DashboardData = processedData?.dashboard ?? defaultDashboardData;
  const categoriesArray = Array.from(Object.keys(categories));

    useEffect(() => { //get the data from localstorage
    const storedData = localStorage.getItem("data");
    if (storedData) {
        try {
        setProcessedData(JSON.parse(storedData));
        } catch (e) {
          console.error("Erro ao parsear o localStorage", e);
        }
    }
    }, []);

    useEffect(() => { //when the data change, set to the localstorage
      console.log("onChange do processedData", processedData)
      try {
        if(processedData) {
          localStorage.setItem("data", JSON.stringify(processedData));
        }
      } catch(e) {
        console.log("deu erro ao passar os dados para o local storage", e)
      }
    }, [processedData])

    useEffect(() => {//just to show when an error occors
      console.log(error)
    }, [error])

    const handleData = (data: ProcessedData) => {//parameter of FileUpload
      setProcessedData(data);
      setError('');
    }

    const handleError = (e: string) => {//parameter of FileUpload
      setError(e);
      setProcessedData(null);
    }

    const handleSucess = () => {//parameter of FileUpload
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }

    const onSubmit = (data: TransactionFormData) => {
      function trnasformTransactionIntoNuTransaction(data: TransactionFormData): NuTransactionData {
        return ({
          id: data.date + data.type + data.counterpartName + data.counterpartDocument,
          category: data.category,
          counterpartName: data.counterpartName,
          counterpartDocument: data.counterpartDocument,
          date: new Date(data.date),
          description: `${data.type} - ${data.counterpartName} - ${data.counterpartDocument}`,
          type: data.type,
          value: data.value,
        })
      }
      const transaction: NuTransactionData = trnasformTransactionIntoNuTransaction(data);

      try{
        if(processedData) {
          setProcessedData({
            dashboard: {
              balance: transaction.type === "income" ?
                processedData.dashboard.balance += transaction.value :
                processedData.dashboard.balance -= transaction.value,
              totalExpenses: transaction.type === "expense" ?
                (processedData.dashboard.totalExpenses -= transaction.value) :
                processedData.dashboard.totalExpenses,
              totalIncome: transaction.type === "income" ?
                (processedData.dashboard.totalIncome += transaction.value) :
                processedData.dashboard.totalIncome,
              transactionsCount: ++processedData.dashboard.transactionsCount,
            },
            barChartData: [],
            pizzaChartData: [],
            transactions: [...processedData.transactions, transaction]
          })
        } else {
          setProcessedData({
            dashboard: {
              balance: transaction.type === "income" ? transaction.value : (transaction.value * -1),
              totalExpenses: transaction.type === "expense" ? transaction.value : 0,
              totalIncome: transaction.type === "income" ? transaction.value : 0,
              transactionsCount: 1,
            },
            barChartData: [],
            pizzaChartData: [],
            transactions: [transaction],
          })
        }
      } catch(e) {
        console.log('Erro ao tentar salvar a nova transação', e);
      }

      toast.success("Transação salva com sucesso!");
      handleSucess();
      reset();
    };

    const { control, register, handleSubmit, reset, watch, setValue, formState: { errors } } =
      useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema) as Resolver<TransactionFormData>,
        defaultValues: {
          numberOfTransactions: 1,
          type: "expense",
          value: 0,
        },
      });

    return (
        <main className="sm:ml-14 p-4 bg-white min-h-dvh">
          <div className={`opacity-0 absolute right-0 flex justify-end ${showAlert && 'opacity-100'}`}>
            <Alert className="max-w-lg bg-green-100">
              <CheckCircle2Icon />
              <AlertTitle>Sucesso! upload de arquivos bem sucedido</AlertTitle>
              <AlertDescription>
                foram importados {dashboard.transactionsCount} transações, totalizando {formatValue(dashboard.totalIncome)} recebidos,
                {formatValue(dashboard.totalExpenses)} gastos, com um balanço total de {formatValue(dashboard.balance)}
              </AlertDescription>
            </Alert>
          </div>
          
          
          <Header />
          <div className="flex w-full">
            <div className="flex w-full justify-center mt-6">
              <Card className="w-full max-w-xl">

                <FileUpload onDataProcessed={handleData} onError={handleError} onSucess={handleSucess} />

              <CardHeader>
                <CardTitle>
                  <h1 className="text-lg sm:text-2xl">Nova Transação Manual</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-4">

                  <div>
                    <Label className="mb-2" htmlFor="date">Data</Label>
                    <Input id="date" type="date" {...register("date")} />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="type" className="mb-2">
                    Tipo
                    </Label>
                    <Select
                      name="type"
                      onValueChange={(value) => setValue("type", value as "income" | "expense")}
                      value={watch("type") || "expense"}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                  </div>

                  <div>
                    <Label className="mb-2" htmlFor="value">
                      Valor
                    </Label>

                    <Controller
                      name="value"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        const [displayValue, setDisplayValue] = React.useState(
                          formatInputValue(value ?? 0)
                        );

                        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const raw = e.target.value;

                          // update the text in the input
                          setDisplayValue(raw);

                          // regex to extract only numbers and commas
                          const cleaned = raw.replace(/[^\d,]/g, "").replace(",", ".");
                          const numericValue = parseFloat(cleaned);

                          if (!isNaN(numericValue)) {
                            onChange(numericValue); // send the number to the form
                          } else {
                            onChange(0);
                          }
                        };

                        const handleBlur = () => {
                          // when left the input the formatting is applied
                          setDisplayValue(formatInputValue(value ?? 0));
                        };

                        return (
                          <>
                            <Input
                              id="value"
                              type="text"
                              placeholder="0,00"
                              value={displayValue}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.value && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.value.message}
                              </p>
                            )}
                          </>
                        );
                      }}
                    />
                  </div>

                  <div>
                    <Label className="mb-2" htmlFor="category">
                      Categoria
                    </Label>
                    <Select
                      name="category"
                      onValueChange={(value) => setValue("category", value)}
                      value={watch("category") || "Outros" }
                    >

                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesArray.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
          
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                  </div>                  

                  {/* name of the part */}
                  <div className="col-span-2">
                    <Label className="mb-2" htmlFor="counterpartName">Nome do Contraparte</Label>
                    <Input id="counterpartName" type="text" {...register("counterpartName")} />
                    {errors.counterpartName && <p className="text-red-500 text-sm mt-1">{errors.counterpartName.message}</p>}
                  </div>

                  {/* part document */}
                  <div className="col-span-2">
                    <Label className="mb-2" htmlFor="counterpartDocument">Documento do Contraparte (opcional)</Label>
                    <Input id="counterpartDocument" type="text" {...register("counterpartDocument")} />
                  </div>

                  {/* buttons */}
                  <div className="flex justify-end items-center gap-2 mt-4 col-span-2">

                    <Button
                      type="button"
                      variant="secondary"
                      className=""
                      onClick={() => reset()}
                    >
                      Limpar
                    </Button>

                    <Button type="submit" className="bg-green-300 hover:bg-green-400" variant={"ghost"}>
                      Salvar Transação
                    </Button>
                    
                  </div>
                </form>
              </CardContent>
            </Card>

            </div>

          </div>
        </main>
    )
}