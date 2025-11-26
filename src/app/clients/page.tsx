'use client';

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatValue } from "@/utils/formatValue";
import { TransactionData } from "@/types/TransactionData";
import { BadgeDollarSign, DollarSign } from "lucide-react";
import { useTransitions } from "@/contexts/transactionsContext";
import GoUp from "@/components/GoUp"
import { DialogDescription } from "@radix-ui/react-dialog";

type ClientGroup = {
  document: string;
  name: string;
  transactions: TransactionData[];
  balance: number;
};

export default function ClientsPage() {
  const { transactionsData } = useTransitions();
  const [clients, setClients] = useState<ClientGroup[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientGroup | null>(null);

  const normalizeText = (text: string) =>
    text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() || "";

  useEffect(() => { //setting clients data
     try {
    const grouped: Record<string, ClientGroup> = {};

    if(transactionsData) transactionsData.forEach(tx => {
      const name = tx.counterpartName?.trim() || "Desconhecido";
      const doc = tx.counterpartDocument || "Sem Documento";
      const key = `${normalizeText(name)}-${doc}`;

      if (!grouped[key]) {
        grouped[key] = {
          document: doc,
          name,
          transactions: [],
          balance: 0,
        };
      }

      grouped[key].transactions.push(tx);
      grouped[key].balance += tx.value;
    });

    setClients(Object.values(grouped));
  } catch (err) {
    console.error("Erro ao processar dados:", err);
  }
  }, [transactionsData])

  // Todas as categorias únicas
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    clients.forEach(c => c.transactions.forEach(tx => { if(tx.category) set.add(tx.category); }));
    return Array.from(set);
  }, [clients]);

  // Filtragem correta por nome e categoria
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchesName = normalizeText(c.name).includes(normalizeText(search));
      const matchesCategory = !filterCategory || c.transactions.some(tx => tx.category === filterCategory);
      return matchesName && matchesCategory;
    });
  }, [clients, search, filterCategory]);

  const hasFilter = search || filterCategory;

  return (
    <main className="p-4 sm:ml-14 bg-white">

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Buscar nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg w-full sm:w-60"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Todas as categorias</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {hasFilter && (
          <button
            onClick={() => { setSearch(""); setFilterCategory(""); }}
            className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Tabela de clientes */}
      <div className="overflow-x-hidden">
        <table className="w-full border-collapse shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr className="back">
              <th className="hidden sm:flex"></th>
              <th className="text-left px-4 py-2">Nome</th>
              <th className="text-left px-4 py-2"><BadgeDollarSign /></th>
              <th className="flex justify-end px-4 py-2"><DollarSign /></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredClients.map(c => (
              <tr
                key={`${c.name}-${c.document}`} 
                onClick={() => setSelectedClient(c)}
                className="hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="hidden  sm:flex px-4 py-2">
                  <Avatar>
                    <AvatarFallback>{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="pl-2 font-medium truncate max-w-25 sm:max-w-90 text-xs sm:text-sm">{c.name}</td>
                <td className="text-right font-semibold w-0.5">{c.transactions.length}</td>
                <td className={`px-2 py-2 text-right font-semibold w-full ${c.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatValue(c.balance)}
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-lg w-full max-h-[80vh] p-4 rounded-xl overflow-hidden">

          <DialogHeader>
            <DialogTitle className="sr-only">Detalhes do cliente</DialogTitle>
          </DialogHeader>

          <DialogDescription className="sr-only">
            resumo de transações por parte
          </DialogDescription>

          {selectedClient && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-base font-bold">
                    {selectedClient.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{selectedClient.name}</span>
                  <span className="text-sm text-gray-600">{selectedClient.document}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {selectedClient.transactions.length} transações
                  </span>
                  <span className={`font-bold py-2 ${selectedClient.balance < 0 ? "text-red-600" : "text-green-600"}`}>total: {formatValue(selectedClient.balance)}</span>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[65vh] space-y-2">

                {selectedClient.transactions.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border hover:bg-gray-100 transition"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {new Date(t.date).toLocaleDateString()}
                      </span>

                      <span className="text-xs text-gray-500">
                        {t.category || "Sem categoria"}
                      </span>
                    </div>

                    {/* Valor */}
                    <span
                      className={`text-sm font-semibold ${
                        t.value >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatValue(t.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <GoUp />

    </main>
  );
}
