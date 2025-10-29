'use client';

import { useEffect, useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatValue } from "@/utils/formatValue";
import { NuTransactionData } from "@/types/NuTransactionData";

type Client = {
  id: string;
  name: string;
  category: string;
  transactions: NuTransactionData[];
  balance: number;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("data");
    if (!stored) return;

    try {
      const parsed: { transactions: NuTransactionData[] } = JSON.parse(stored);
      const txArray = parsed.transactions || [];

      const grouped: Record<string, Client> = {};

      txArray.forEach(t => {
        const name = t.description || "Desconhecido";
        if (!grouped[name]) {
          grouped[name] = { id: t.id, name, category: t.category, transactions: [], balance: 0 };
        }
        grouped[name].transactions.push(t);
        grouped[name].balance += t.value;
      });

      setClients(Object.values(grouped));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }, []);


  const filteredClients = useMemo(() => {
    return clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [clients, search]);

  return (
    <main className="p-4 sm:ml-14">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="text-sm text-gray-600">
          Mostrando {filteredClients.length} de {clients.length} clientes
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2 text-left font-semibold">Nome</th>
              <th className="px-4 py-2 text-left font-semibold">Categoria</th>
              <th className="px-4 py-2 text-center font-semibold">Transações</th>
              <th className="px-4 py-2 text-right font-semibold">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredClients.map(client => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 cursor-pointer transition"
                onClick={() => setSelectedClient(client)}
              >
                <td className="px-4 py-2">
                  <Avatar>
                    <AvatarFallback>{client.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 py-2 font-medium">{client.name}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    {client.category}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">{client.transactions.length}</td>
                <td className={`px-4 py-2 text-right font-semibold ${client.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatValue(client.balance)}
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{selectedClient?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div>{selectedClient?.name}</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="mt-2 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
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

              <div>
                <h4 className="font-semibold mb-3">Transações Relacionadas</h4>
                <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                  {selectedClient.transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Nenhuma transação encontrada.</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Data</th>
                          <th className="px-4 py-2 text-left">Descrição</th>
                          <th className="px-4 py-2 text-left">Categoria</th>
                          <th className="px-4 py-2 text-right">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedClient.transactions.map((t, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{t.description}</td>
                            <td className="px-4 py-2">{t.category}</td>
                            <td className={`px-4 py-2 text-right font-semibold ${t.value >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatValue(t.value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
