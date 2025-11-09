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
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Header } from "@/components/header";
import { formatValue, formatInputValue, generateDashboardData } from "@/utils/formatValue";
import { transactionSchema } from "@/utils/transactionSchema";
import { CheckCircle2Icon } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { TransactionData } from "@/types/TransactionData";
import { useTransitions } from "@/contexts/transactionsContext"

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function Data() {
  const { transactionsData, setTransactionsData } = useTransitions();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const categoriesArray = Array.from(Object.keys(categories));
  const dashboard = generateDashboardData(transactionsData ?? []);
  const [displayValue, setDisplayValue] = useState("0,00"); 


    const handleSucess = () => {//parameter of FileUpload
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }

    const onSubmit = (data: TransactionFormData) => {
      function trnasformTransactionIntoNuTransaction(data: TransactionFormData): TransactionData {
        return ({
          id: data.date + data.type + data.counterpartName + data.counterpartDocument,
          category: data.category,
          counterpartName: data.counterpartName,
          counterpartDocument: data.counterpartDocument,
          date: new Date(data.date),
          description: `${data.type} - ${data.counterpartName} - ${data.counterpartDocument}`,
          type: data.type,
          value: data.type === "income" ? data.value : (data.value * -1),
        })
      }
      const transaction: TransactionData = trnasformTransactionIntoNuTransaction(data);

      try{        
        if(transactionsData) {
          setTransactionsData([ ...transactionsData, transaction ]);
        } else {
          setTransactionsData([transaction]);
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
                foram importados {transactionsData?.length} transações, totalizando {formatValue(dashboard.totalIncome)} recebidos,
                {formatValue(dashboard.totalExpenses)} gastos, com um balanço total de {formatValue(dashboard.balance)}
              </AlertDescription>
            </Alert>
          </div>
          
          
          <Header />
          <div className="flex w-full">
            <div className="flex w-full justify-center mt-6">
              <Card className="w-full max-w-xl">

                <FileUpload transactions={transactionsData ?? []} setTransactions={setTransactionsData}  onSucess={handleSucess} />

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

                        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const raw = e.target.value;

                          setDisplayValue(raw); // atualiza texto

                          const cleaned = raw.replace(/[^\d,]/g, "").replace(",", ".");
                          const numericValue = parseFloat(cleaned);

                          if (!isNaN(numericValue)) {
                            onChange(numericValue); // envia o número pro form
                          } else {
                            onChange(0);
                          }
                        };

                        const handleBlur = () => {
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