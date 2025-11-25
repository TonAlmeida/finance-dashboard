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
import React, { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { formatInputValue } from "@/utils/formatValue";
import { transactionSchema } from "@/utils/transactionSchema";
import FileUpload from "@/components/FileUpload";
import { TransactionData } from "@/types/TransactionData";
import { useTransitions } from "@/contexts/transactionsContext"
import { expensesCategories, incomeCategories } from "@/utils/categoriesList"
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrashIcon } from "lucide-react";


type TransactionFormData = z.infer<typeof transactionSchema>;

export default function Data() {
  const { transactionsData, setTransactionsData } = useTransitions();
  const [displayValue, setDisplayValue] = useState("");
  const router = useRouter();
  const [confirmDeletion, setConfirmDelection] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

    const handleSucess = () => {
      router.push("/");
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
      } finally {
        setDisplayValue("");
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
          value: undefined,
          category: "Outros"
        },
      });

      const typeValue = watch("type");

      useEffect(() => {
        setValue("category", "Outros");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [typeValue]);


      const deleteAllData = () => {
        setConfirmDelection(true);
        setTransactionsData([]);
        setTimeout(() => {
          setConfirmDelection(false);
        }, 3000);
      }

    return (
        <main className="sm:ml-14 bg-white relative">  

          {confirmDeletion && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
            <Alert className="bg-red-500 text-white">
              <TrashIcon className="h-4 w-4" />
              <AlertTitle className="text-white">Sucesso</AlertTitle>
              <AlertDescription className="text-white">
                Dados apagados com sucesso!
              </AlertDescription>
            </Alert>
          </div>
        )}

          <Header />
          <div className="flex max-w-full">
            <div className="flex w-full justify-center">
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

                          setDisplayValue(raw);

                          const cleaned = raw.replace(/[^\d,]/g, "").replace(",", ".");
                          const numericValue = parseFloat(cleaned);

                          if (!isNaN(numericValue)) {
                            onChange(numericValue);
                          } else {
                            onChange(0);
                          }
                        };

                        const handleBlur = () => {
                          if (value === undefined || value === null || value === 0) {
                            setDisplayValue("");
                            return;
                          }

                          setDisplayValue(formatInputValue(value));
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
                      value={watch("category") || "Outros"}
                    >

                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          watch("type") === "income"
                          ? Object.entries(incomeCategories).map(([key]) => (
                              <SelectItem key={key} value={key}>
                                {key}
                              </SelectItem>
                            ))
                          : Object.entries(expensesCategories).map(([key]) => (
                              <SelectItem key={key} value={key}>
                                {key}
                              </SelectItem>
                            ))
                        }
                      </SelectContent>
                    </Select>
          
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                  </div>

                  <div className="col-span-2">
                    <Label className="mb-2" htmlFor="counterpartName">Nome do Contraparte</Label>
                    <Input id="counterpartName" type="text" {...register("counterpartName")} />
                    {errors.counterpartName && <p className="text-red-500 text-sm mt-1">{errors.counterpartName.message}</p>}
                  </div>

                  <div className="col-span-2">
                    <Label className="mb-2" htmlFor="counterpartDocument">Documento do Contraparte (opcional)</Label>
                    <Input id="counterpartDocument" type="text" {...register("counterpartDocument")} />
                  </div>

                  <div className="flex justify-end items-center gap-2 mt-4 col-span-2">

                    <Button
                      type="button"
                      variant="ghost"
                      className="bg-gray-100 hover:bg-gray-300 text-black cursor-pointer hover:shadow-2xl"
                      onClick={() => {
                        reset();
                        setDisplayValue("");
                      }}
                    >
                      Limpar
                    </Button>

                    <Button type="submit" className="bg-green-300 hover:bg-green-400 cursor-pointer" variant={"ghost"}>
                      Salvar Transação
                    </Button>
                    
                  </div>
                </form>
              </CardContent>
            </Card>
            </div>
          </div>


          <section className="flex justify-around items-center bg-red-100 border-t-2 border-red-500 mt-4 p-4 text-red-500">
            <p>Ao apagar, esses dados não poderão ser recuperados!</p>
            <Button
              className="font-semibold border-red-500 border hover:bg-red-500 hover:text-white"
              variant="ghost"
              onClick={() => setOpen(true)}
            >
              Delete all data
            </Button>
          </section>

          {/* Modal */}
          {open && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white rounded-md p-6 w-[90%] max-w-sm shadow-lg">
                <h2 className="text-xl font-semibold text-red-600 mb-3">
                  Confirmar exclusão
                </h2>

                <p className="text-gray-700 mb-6">
                  Tem certeza que deseja apagar todos os dados? Essa ação não poderá ser desfeita.
                </p>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    className="border border-gray-300"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>

                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      deleteAllData();
                      setOpen(false);
                    }}
                  >
                    Apagar tudo
                  </Button>
                </div>
              </div>
            </div>
          )}

        </main>
    )
}