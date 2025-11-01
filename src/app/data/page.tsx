"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2Icon, CheckIcon, DollarSign, FileText, User } from "lucide-react";
import { toast } from "sonner";
import { categories } from "@/utils/categoriesList";
import { useEffect, useState } from "react";
import { ProcessedData } from "@/types/processedData";
import FileUpload from "@/components/FileUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Header } from "@/components/header";
import { DashboardData } from "@/types/dashboardData";
import { formatValue } from "@/utils/formatValue";

export const transactionSchema = z.object({
  date: z.string().nonempty("A data é obrigatória"),
  value: z.number().positive("O valor deve ser positivo"),
  description: z.string().min(3, "Descrição muito curta"),
  category: z.string().nonempty("A categoria é obrigatória"),
  type: z
    .enum(["income", "expense"])
    .refine((val) => !!val, { message: "Selecione o tipo de transação" }),
  counterpartName: z.string().nonempty("Informe o nome da contraparte"),
  counterpartDocument: z.string().optional(),
  numberOfTransactions: z.number().min(1, "Número inválido")
})

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

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TransactionFormData>({
      resolver: zodResolver(transactionSchema),
      defaultValues: {
        numberOfTransactions: 1,
        type: "expense",
      },
    });

    const onSubmit = (data: TransactionFormData) => {
      console.log("✅ Transaction:", data);
      toast.success("Transação salva com sucesso!");
      reset();
    };

    const onSucess = () => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }

    const defaultDashboardData: DashboardData = {
      balance: 0,
      totalExpenses: 0,
      totalIncome: 0,
      transactionsCount: 0
    }
    const dashboard: DashboardData = processedData?.dashboard ?? defaultDashboardData;

    return (
        <main className="sm:ml-14 p-4 bg-gradient-to-r from-gray-50 to-gray-300 h-dvh">
          <div className={`opacity-0 w-full absolute flex justify-end pr-28 ${showAlert && 'opacity-100'}`}>
            <Alert className="max-w-lg bg-green-100">
              <CheckCircle2Icon />
              <AlertTitle>Sucesso! arquivos carregados corretamente</AlertTitle>
              <AlertDescription>
                foram importados {dashboard.transactionsCount} transações, totalizando {formatValue(dashboard.totalIncome)} recebidos,
                {formatValue(dashboard.totalExpenses)} gastos, com um balanço total de {formatValue(dashboard.balance)}
              </AlertDescription>
            </Alert>
          </div>
          
          
          <Header />
          <div className="flex w-full">
            <Card className="mx-auto max-w-xl shadow-lg border rounded-2xl bg-white w-full m-4">
              <CardHeader>
                <FileUpload onDataProcessed={handleData} onError={handleError} onSucess={onSucess} />
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText size={20} /> Nova Transação Manual
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                      <Calendar size={16} /> Data
                    </Label>
                    <Input type="date" id="date" {...register("date")} className="max-w-40"/>
                    {errors.date && <p className="text-red-600 text-xs">{errors.date.message}</p>}
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor="value" className="flex items-center gap-2 mb-2">
                      <DollarSign size={16} /> Valor
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      id="value"
                      className="max-w-40"
                      {...register("value", { valueAsNumber: true })}
                    />
                    {errors.value && <p className="text-red-600 text-xs">{errors.value.message}</p>}
                  </div>

                  <div className="flex flex-col">
                    <Label className="mb-2">Categoria</Label>
                    <Select onValueChange={(v) => setValue("category", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(categories).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-600 text-xs">{errors.category.message}</p>}
                  </div>

                  {/* Tipo */}
                  <div className="flex flex-col">
                    <Label className="mb-2">Tipo</Label>
                    <Select onValueChange={(v) => setValue("type", v as "income" | "expense")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-red-600 text-xs">{errors.type.message}</p>}
                  </div>

                  <div className="flex flex-col col-span-2">
                    <Label htmlFor="counterpartName" className="flex items-center gap-2 mb-2">
                      <User size={16} /> Nome da contraparte
                    </Label>
                    <Input type="text" id="counterpartName" {...register("counterpartName")} />
                    {errors.counterpartName && <p className="text-red-600 text-xs">{errors.counterpartName.message}</p>}
                  </div>

                  <div className="flex flex-col col-span-2">
                    <Label htmlFor="counterpartDocument" className="mb-2">Documento (opcional)</Label>
                    <Input type="text" id="counterpartDocument" {...register("counterpartDocument")} />
                  </div>

                  
                  <div className="flex justify-end gap-2 pt-2 col-span-2">
                    <Button className="cursor-pointer" type="button" variant="outline" onClick={() => reset()}>
                      Limpar
                    </Button>
                    <Button type="submit" variant={"ghost"} className="bg-blue-100 hover:bg-blue-200 cursor-pointer text-blue-600 px-10 py-2">
                      Salvar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
    )
}