'use client';

import { useState, useMemo } from "react";
import { Transaction } from "@/types/transaction";
import { Search, Filter } from "lucide-react";
import { formatValue } from "@/utils/formatValue";

interface TransactionsProps {
  data?: Transaction[]; // Pode ser undefined inicialmente
}

export default function Transactions({ data = [] }: TransactionsProps) {
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const categories = Array.from(new Set(data.map((t) => t.category)));

  const filteredTransactions = useMemo(() => {
    return data.filter((t) => {
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());

      const transactionDate = new Date(t.date);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;
      const matchesDate =
        (!start || transactionDate >= start) && (!end || transactionDate <= end);

      return matchesType && matchesCategory && matchesSearch && matchesDate;
    });
  }, [data, typeFilter, categoryFilter, searchTerm, dateRange]);

  return (
    <section className="flex-1 bg-white rounded-2xl shadow p-4 max-h-[500px] overflow-scroll">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Filter size={18} /> Transactions
        </h2>

        <div className="flex flex-wrap gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
            className="border rounded-md px-2 py-1 text-sm"
          />
          <input
            type="date"
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
            className="border rounded-md px-2 py-1 text-sm"
          />

          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md pl-7 pr-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="p-2">Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">Category</th>
              <th className="p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-2 text-gray-500">
                  {new Date(t.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="p-2">{t.description}</td>
                <td className="p-2">{t.category}</td>
                <td className={`p-2 text-right font-medium ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {formatValue(t.amount)}
                </td>
              </tr>
            ))}

            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
