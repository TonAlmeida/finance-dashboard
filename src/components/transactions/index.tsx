"use client";

import { useMemo, useState } from "react";
import { useTransitions } from "@/contexts/transactionsContext";
import { TransactionData } from "@/types/TransactionData";
import { Search, Filter, ArrowUp, ArrowDown, DollarSign, Pencil } from "lucide-react";
import { formatValue } from "@/utils/formatValue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TransactionEditModal } from "../transacrtionsEditModal";
import GoUp from "../GoUp";

type SortField = "date" | "value" | "description" | "category";
type SortDirection = "asc" | "desc";

export default function Transactions() {
  const { transactionsData, setTransactionsData } = useTransitions();
  const [editing, setEditing] = useState<TransactionData | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const transactions = transactionsData ?? [];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const t of transactions) cats.add(t.category);
    return Array.from(cats).sort();
  }, [transactions]);

  const filtered = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return transactions.filter((t) => {
      const matchCat = categoryFilter === "all" || t.category === categoryFilter;
      const matchSearch = t.description.toLowerCase().includes(search);
      return matchCat && matchSearch;
    });
  }, [transactions, categoryFilter, searchTerm]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = sortField === "date" ? new Date(a.date).getTime() : a[sortField];
      const bVal = sortField === "date" ? new Date(b.date).getTime() : b[sortField];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    setSortField(field);
    setSortDirection(
      sortField === field && sortDirection === "asc" ? "desc" : "asc"
    );
  };

  const handleSave = () => {
    if (!editing) return;
    setTransactionsData((prev) =>
      (prev ?? []).map((t) => (t.id === editing.id ? editing : t))
    );
    setEditing(null);
  };

  const formatDateInput = (date: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  };

  return (
    <section className="flex-1 p-4 bg-white shadow rounded-md">
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <h2 className="font-semibold text-gray-800 text-lg">Transações</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[160px] text-sm">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-[180px]">
            <Search size={16} className="absolute left-2 top-2 text-gray-400" />
            <Input
              className="pl-7"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b text-left bg-gray-50">
                {["date", "description", "category", "value"].map((field) => (
                  <th
                    key={field}
                    className="p-2 font-semibold"
                    onClick={() => toggleSort(field as SortField)}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      {field === "date" && "Data"}
                      {field === "description" && "Descrição"}
                      {field === "category" && "Categoria"}
                      {field === "value" && <DollarSign size={14} />}
                      {sortField === field &&
                        (sortDirection === "asc" ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        ))}
                    </div>
                  </th>
                ))}
                <th className="p-2 text-right">Editar</th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((t) => (
                <tr
                  key={t.id}
                  className="border-b hover:bg-gray-50 transition cursor-default"
                >
                  <td className="p-2 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="p-2 max-w-[250px] truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="truncate">{t.description}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t.description}
                      </TooltipContent>
                    </Tooltip>
                  </td>

                  <td className="p-2">{t.category}</td>

                  <td
                    className={`p-2 text-right font-semibold ${
                      t.value >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatValue(t.value)}
                  </td>

                  <td className="p-2 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing({ ...t })}
                      className="cursor-pointer"
                    >
                      <Pencil size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3 mt-2">
        {sorted.map((t) => (
          <div
            key={t.id}
            className="bg-gray-50 border rounded-lg p-3 shadow-sm flex justify-between items-center"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">
                {formatValue(t.value)}
              </span>

              <span className="text-xs text-gray-500">
                {new Date(t.date).toLocaleDateString("pt-BR")}
              </span>

              <span className="text-xs text-gray-500">
                {t.category ?? "Sem categoria"}
              </span>
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditing({ ...t })}
            >
              <Pencil size={16} />
            </Button>
          </div>
        ))}
      </div>

      <TransactionEditModal
        open={!!editing}
        onClose={() => setEditing(null)}
        transaction={editing}
        categories={categories}
        onSave={(updated) => {
          setTransactionsData((prev) =>
            (prev ?? []).map((t) => (t.id === updated.id ? updated : t))
          );
        }}
      />

      <GoUp />
    </section>
  );
}
