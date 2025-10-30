'use client';

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatValue } from "@/utils/formatValue";
import { NuTransactionData } from "@/types/NuTransactionData";

type ClientGroup = {
  document: string;
  name: string;
  transactions: NuTransactionData[];
  balance: number;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientGroup[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientGroup | null>(null);

  const normalizeText = (text: string) =>
    text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() || "";

  // Agrupamento correto por nome+documento
  useEffect(() => {
    const stored = localStorage.getItem("data");
    if (!stored) return;

    try {
      const parsed: { transactions: NuTransactionData[] } = JSON.parse(stored);
      const grouped: Record<string, ClientGroup> = {};

      parsed.transactions.forEach(tx => {
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
  }, []);

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
    <main className="p-4 sm:ml-14">
      {/* Filtros */}
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
            <tr>
              <th></th>
              <th className="text-left px-4 py-2">Nome</th>
              <th className="text-left px-4 py-2">Transações</th>
              <th className="text-right px-4 py-2">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredClients.map(c => (
              <tr
                key={`${c.name}-${c.document}`} 
                onClick={() => setSelectedClient(c)}
                className="hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="px-4 py-2">
                  <Avatar>
                    <AvatarFallback>{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 py-2 font-medium truncate max-w-xs">{c.name}</td>
                <td className="px-4 py-2 text-right font-semibold">{c.transactions.length}</td>
                <td className={`px-4 py-2 text-right font-semibold ${c.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
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

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-3xl w-full max-h-[70vh] p-4 overflow-hidden rounded-lg">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{selectedClient.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{selectedClient.name}</p>
                    <p className="text-sm text-gray-600">{selectedClient.document}</p>
                    <p className="text-sm text-gray-500 mt-1">Transações: {selectedClient.transactions.length}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="overflow-y-auto max-h-[60vh] overflow-x-hidden border rounded-lg mt-4">
                <table className="w-full table-fixed text-sm border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 w-24">Data</th>
                      <th className="px-4 py-2 w-full">Descrição</th>
                      <th className="px-4 py-2 w-28 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedClient.transactions.map((t, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 truncate max-w-full">{t.description}</td>
                        <td className={`px-4 py-2 text-right font-semibold ${t.value >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatValue(t.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
