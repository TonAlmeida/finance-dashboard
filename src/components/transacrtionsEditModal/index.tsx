"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TransactionData } from "@/types/TransactionData";


interface TransactionEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updated: TransactionData) => void;
  transaction: TransactionData | null;
  categories: string[];
}


export function TransactionEditModal({ open, onClose, onSave, transaction, categories }: TransactionEditModalProps) {
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [value, setValue] = useState<string>('');
  const [type, setType] = useState<"positive" | "negative">("positive");

  useEffect(() => {
    if (!transaction) return;

    setDate(transaction.date.toISOString().split("T")[0]);
    setDesc(transaction.description);
    setCategory(transaction.category);
    setValue(String(Math.abs(transaction.value)));
    setType(transaction.value >= 0 ? "positive" : "negative");
  }, [transaction]);

  const handleSave = () => {
    const finalValue = type === "positive"
    ? JSON.parse(value) 
    : JSON.parse("-" + value);

   onSave({
      id: transaction?.id ?? crypto.randomUUID(),
      date: new Date(date),
      description: desc,
      category,
      type,
      value: +finalValue,
      counterpartName: transaction?.counterpartName ?? "",
      counterpartDocument: transaction?.counterpartDocument ?? "",
    });



    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          
          <div>
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="col-span-2">
            <Label>Descrição</Label>
            <Input value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>

          <div>
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col justify-center items-center md:flex-row md:justify-around">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(value: "positive" | "negative") => setType(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="positive">Receita</SelectItem>
                    <SelectItem value="negative">Despesa</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label>Valor</Label>
            <Input
              type="number"
              min={1}
              step={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant={"ghost"} className="bg-green-300 hover:bg-green-500 px-10 py-2" onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
