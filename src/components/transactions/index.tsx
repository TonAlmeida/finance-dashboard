'use client';

import { useState, useMemo } from "react";
import { NuTransactionData } from "@/types/NuTransactionData";
import { Search, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { formatValue } from "@/utils/formatValue";

interface TransactionsProps {
  data?: NuTransactionData[];
}

type SortField = 'date' | 'value' | 'description' | 'category';
type SortDirection = 'asc' | 'desc';

export default function Transactions({ data = [] }: TransactionsProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const categories = useMemo(() => {
    return Array.from(new Set(data.map((t) => t.category).filter(Boolean))).sort();
  }, [data]);

  const filteredTransactions = useMemo(() => {
    return data.filter((t) => {
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (dateRange.start || dateRange.end) {
        const transactionDate = new Date(t.date);
        const start = dateRange.start ? new Date(dateRange.start) : null;
        const end = dateRange.end ? new Date(dateRange.end) : null;

        if (start && transactionDate < start) return false;
        if (end) {
          const endDate = new Date(end);
          endDate.setHours(23, 59, 59, 999);
          if (transactionDate > endDate) return false;
        }
      }

      return matchesCategory && matchesSearch;
    });
  }, [data, categoryFilter, searchTerm, dateRange]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (sortField) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortField, sortDirection]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.value > 0)
      .reduce((sum, t) => sum + t.value, 0);

    const expense = filteredTransactions
      .filter(t => t.value < 0)
      .reduce((sum, t) => sum + t.value, 0);

    return {
      total: income + expense,
      income,
      expense: Math.abs(expense),
      count: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Alimentação': 'bg-green-100 text-green-800',
      'Tabacaria': 'bg-red-100 text-red-800',
      'Educação': 'bg-blue-100 text-blue-800',
      'Saúde': 'bg-pink-100 text-pink-800',
      'Combustível': 'bg-orange-100 text-orange-800',
      'Mercado': 'bg-emerald-100 text-emerald-800',
      'Alimentação Externa': 'bg-lime-100 text-lime-800',
      'Transferência': 'bg-purple-100 text-purple-800',
      'Serviços Financeiros': 'bg-cyan-100 text-cyan-800',
      'Receita': 'bg-teal-100 text-teal-800',
      'Outros': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <section className="flex-1 bg-white rounded-2xl shadow p-4 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Filter size={18} /> Transações
          </h2>
          <p className="text-sm text-gray-500">
            Saldo da lista:{" "}
            <span className={stats.total >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {formatValue(stats.total)}
            </span> <br/>
            {stats.count} transações
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            <option value="all">Todas categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            placeholder="Data inicial"
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
            className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <input
            type="date"
            placeholder="Data final"
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
            className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />

          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md pl-7 pr-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {(categoryFilter !== "all" || searchTerm || dateRange.start || dateRange.end) && (
            <button
              onClick={() => {
                setCategoryFilter("all");
                setSearchTerm("");
                setDateRange({});
              }}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left bg-gray-600 text-gray-50">
              <th 
                className="p-2 font-semibold cursor-pointer hover:bg-gray-400 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Data
                  {getSortIcon('date')}
                </div>
              </th>
              <th 
                className="p-2 font-semibold cursor-pointer hover:bg-gray-400 transition-colors"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center gap-1 bg-gray">
                  Descrição
                  {getSortIcon('description')}
                </div>
              </th>
              <th 
                className="hidden sm:flex p-2 font-semibold cursor-pointer hover:bg-gray-400 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Categoria
                  {getSortIcon('category')}
                </div>
              </th>
              <th className="p-2 font-semibold text-right cursor-pointer hover:bg-gray-400 transition-colors"
                  onClick={() => handleSort('value')}>
                <div className="flex items-center justify-end gap-1">
                  Valor
                  {getSortIcon('value')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((t, index) => (
              <tr key={`${t.id}-${index}`} className="border-b hover:bg-gray-50 transition">
                <td className="p-2 text-gray-500 whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="p-2">
                  <div className="font-medium text-xs sm:text-sm truncate w-full max-w-35 sm:max-w-[1000px]">{t.description}</div>
                </td>
                <td className="hidden sm:flex p-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(t.category)}`}>
                    {t.category}
                  </span>
                </td>
                <td className={`p-2 text-right font-semibold ${t.value >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatValue(t.value)}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {sortedTransactions.length > 0 && (
        <div className="mt-4 pt-3 border-t text-sm bg-gray-300 p-2 rounded-md">
          <div className="flex justify-between">
            <span>Receitas: <span className="text-green-600 font-medium">{formatValue(stats.income)}</span></span>
            <span>Despesas: <span className="text-red-600 font-medium">{formatValue(stats.expense)}</span></span>
            <span>Saldo: <span className={stats.total >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {formatValue(stats.total)}
            </span></span>
          </div>
        </div>
      )}
    </section>
  );
}
