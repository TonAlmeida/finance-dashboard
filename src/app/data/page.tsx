"use client"
import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { categories } from "@/utils/categoriesList";
import { useEffect, useState } from "react";
import { ProcessedData } from "@/types/processedData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Header } from "@/components/header";
import { DashboardData } from "@/types/dashboardData";
import { formatValue } from "@/utils/formatValue";
import { transactionSchema } from "@/utils/transactionSchema";
import { CheckCircle2Icon } from "lucide-react";
import FileUpload from "@/components/FileUpload";

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function Data() {

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
      console.log(error)
    }, [error])

    const handleData = (data: ProcessedData) => {
      setProcessedData(data);
      setError('');
    }

    const handleError = (e: string) => {
      setError(e);
      setProcessedData(null);
    }

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } =
      useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema) as Resolver<TransactionFormData>, // força compatibilidade
        defaultValues: {
          numberOfTransactions: 1,
          type: "expense",
          value: 0,
        },
      });


    const handleSucess = () => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }

    const onSubmit = (data: TransactionFormData) => {
      console.log("✅ Transaction:", data);
      toast.success("Transação salva com sucesso!");
      reset();
    };

    const defaultDashboardData: DashboardData = {
      balance: 0,
      totalExpenses: 0,
      totalIncome: 0,
      transactionsCount: 0
    }
    const dashboard: DashboardData = processedData?.dashboard ?? defaultDashboardData;
    const categoriesArray = Array.from(Object.keys(categories));

    return (
        <main className="sm:ml-14 p-4 bg-white h-dvh">
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
                  {/* Tipo de Transação */}
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      {...register("type")}
                      onValueChange={(value) => setValue("type", value as "income" | "expense")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                  </div>

                  {/* Categoria */}
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      {...register("category")}
                      onValueChange={(value) => setValue("category", value)}
                    >
                      <SelectTrigger>
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

                  {/* Valor */}
                  <div>
                    <Label htmlFor="value">Valor</Label>
                    <Input
                      type="number"
                      step="1"
                      placeholder="0"
                      {...register("value", { valueAsNumber: true })}
                    />
                    {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>}
                  </div>

                  {/* Nome do Contraparte */}
                  <div className="col-span-2">
                    <Label htmlFor="counterpartName">Nome do Contraparte</Label>
                    <Input type="text" {...register("counterpartName")} />
                    {errors.counterpartName && <p className="text-red-500 text-sm mt-1">{errors.counterpartName.message}</p>}
                  </div>

                  {/* Documento do Contraparte */}
                  <div className="col-span-2">
                    <Label htmlFor="counterpartDocument">Documento do Contraparte (opcional)</Label>
                    <Input type="text" {...register("counterpartDocument")} />
                  </div>

                  {/* Botões */}
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