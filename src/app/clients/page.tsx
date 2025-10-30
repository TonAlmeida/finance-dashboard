'use client';

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatValue } from "@/utils/formatValue";
import { NuTransactionData } from "@/types/NuTransactionData";

type ClientGroup = {
  document: string;
  name: string;
  category: string;
  transactions: NuTransactionData[];
  balance: number;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientGroup[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientGroup | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("data");
    if (!stored) return;

    try {
      const parsed: { transactions: NuTransactionData[] } = JSON.parse(stored);
      const grouped: Record<string, ClientGroup> = {};

      parsed.transactions.forEach(tx => {
        const doc = tx.counterpartDocument || "Sem Documento";
        if (!grouped[doc]) {
          grouped[doc] = {
            document: doc,
            name: tx.counterpartName || "Desconhecido",
            category: tx.category,
            transactions: [],
            balance: 0,
          };
        }
        grouped[doc].transactions.push(tx);
        grouped[doc].balance += tx.value;
      });

      setClients(Object.values(grouped));
    } catch (err) {
      console.error("Erro ao processar dados:", err);
    }
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchesName = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !filterCategory || c.category === filterCategory;
      const matchesType =
        !filterType || c.transactions.some(tx => tx.type === filterType);
      return matchesName && matchesCategory && matchesType;
    });
  }, [clients, search, filterCategory, filterType]);

  return (
    <main className="p-4 sm:ml-14">
      <div className="flex flex-wrap gap-3 mb-6 items-center">
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
          {[...new Set(clients.map(c => c.category))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Todos os tipos</option>
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th></th>
              <th className="text-left px-4 py-2">Nome</th>
              <th className="text-left px-4 py-2">Documento</th>
              <th className="text-left px-4 py-2">Categoria</th>
              <th className="text-center px-4 py-2">Transações</th>
              <th className="text-right px-4 py-2">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredClients.map(c => (
              <tr
                key={c.document}
                onClick={() => setSelectedClient(c)}
                className="hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="px-4 py-2">
                  <Avatar>
                    <AvatarFallback>{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 py-2 font-medium">{c.name}</td>
                <td className="px-4 py-2">{c.document}</td>
                <td className="px-4 py-2">{c.category}</td>
                <td className="px-4 py-2 text-center">{c.transactions.length}</td>
                <td className={`px-4 py-2 text-right font-semibold ${c.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatValue(c.balance)}
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{selectedClient.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedClient.name}</p>
                    <p className="text-sm text-gray-600">{selectedClient.document}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Transações</p>
                    <p className="font-medium text-lg">{selectedClient.transactions.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Saldo</p>
                    <p className={`font-semibold text-lg ${selectedClient.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatValue(selectedClient.balance)}
                    </p>
                  </div>
                </div>

                <table className="w-full text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Data</th>
                      <th className="px-4 py-2 text-left">Descrição</th>
                      <th className="px-4 py-2 text-left">Categoria</th>
                      <th className="px-4 py-2 text-left">Tipo</th>
                      <th className="px-4 py-2 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedClient.transactions.map((t, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{t.description}</td>
                        <td className="px-4 py-2">{t.category}</td>
                        <td className="px-4 py-2 capitalize">{t.type}</td>
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
