// src/app/clients/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatValue } from "@/utils/formatValue";
import { ProcessedData } from "@/types/processedData";
import { Client } from "@/types/client";
import { Transaction } from "@/types/transaction";
import { generateClients } from "@/utils/extractClients";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "positive" | "negative">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [minTransactions, setMinTransactions] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Carrega dados do localStorage e popula clients + transactions
  useEffect(() => {
    const stored = localStorage.getItem("data");
    if (!stored) return;
    try {
      const parsed: ProcessedData = JSON.parse(stored);
      const txs: Transaction[] = parsed.transactions || [];
      const cls = generateClients(txs);
      setTransactions(txs);
      setClients(cls);
    } catch (err) {
      console.error("Erro ao carregar dados do localStorage:", err);
    }
  }, []);

  // Extrai categorias únicas para o filtro
  const categories = useMemo(() => {
    const cats = clients.map(c => c.category).filter(Boolean);
    return Array.from(new Set(cats)).sort();
  }, [clients]);

  const filteredClients = useMemo(() => {
    return clients
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      .filter((c) => {
        if (filterType === "positive") return c.balance > 0;
        if (filterType === "negative") return c.balance < 0;
        return true;
      })
      .filter((c) => c.transactions >= minTransactions)
      .filter((c) => {
        if (filterCategory === "all") return true;
        return c.category === filterCategory;
      });
  }, [clients, search, filterType, minTransactions, filterCategory]);

  const clientTransactions = useMemo(() => {
    if (!selectedClient) return [];
    const cid = selectedClient.id;

    return transactions.filter((t) => {
      // safe casts
      // 1) clientId explícito (preferível)
      if ((t as any).clientId !== undefined && Number((t as any).clientId) === cid) {
        return true;
      }

      // 2) documento numérico/string na transação (ex: t.document ou t.documentId)
      const docCandidates = [
        (t as any).document,
        (t as any).documentId,
        (t as any).cpfCnpj,
      ].filter(Boolean);

      for (const d of docCandidates) {
        // normaliza: remove não-dígitos e compara como número
        const normalized = String(d).replace(/\D/g, "");
        if (normalized && Number(normalized) === cid) return true;
      }

      // 3) fallback por nome — procura por substrings do nome na descrição
      const name = selectedClient.name.toLowerCase();
      const desc = (t.description || "").toString().toLowerCase();
      if (name && desc.includes(name)) return true;

      // 4) por id da transação igual ao id do client (pouco provável, mas seguro)
      if ((t as any).id !== undefined && Number((t as any).id) === cid) return true;

      return false;
    });
  }, [selectedClient, transactions]);

  return (
    <main className="sm:ml-14 p-4">
      {/* filtros */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex gap-2 items-center flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="all">Todos os saldos</option>
              <option value="positive">Saldo positivo</option>
              <option value="negative">Saldo negativo</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-40"
            >
              <option value="all">Todas categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="number"
              min={0}
              placeholder="Transações mín."
              value={minTransactions}
              onChange={(e) => setMinTransactions(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg shadow-sm w-32 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Mostrando {filteredClients.length} de {clients.length} clientes
        </div>
      </div>

      {/* tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700"></th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Nome</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Documento</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Categoria</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Tipo</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Data</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Transações</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Saldo</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedClient(client)}
              >
                <td className="px-4 py-2">
                  <Avatar>
                    <AvatarImage
                      src={
                        client.urlImage ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4pTaa9fW0mgaMx_klIjmYFY5D-bnqvXPI33h5O4nAM2cPzzqBbU4eGhAFU7vhm2pSCyM&usqp=CAU"
                      }
                    />
                    <AvatarFallback>{client.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </td>

                <td className="px-4 py-2">#{client.id}</td>
                <td className="px-4 py-2 font-medium">{client.name}</td>
                <td className="px-4 py-2 text-sm">{client.document || "-"}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.category === 'Transferência Recebida' ? 'bg-green-100 text-green-800' :
                    client.category === 'Transferência Enviada' ? 'bg-blue-100 text-blue-800' :
                    client.category === 'Compra Débito' ? 'bg-purple-100 text-purple-800' :
                    client.category === 'Pagamento Recebido' ? 'bg-emerald-100 text-emerald-800' :
                    client.category === 'Reembolso' ? 'bg-amber-100 text-amber-800' :
                    client.category === 'Investimento FII' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {client.category}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  {client.transferType ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      {client.transferType}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 text-sm">
                  {client.date ? new Date(client.date).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {client.transactions}
                  </span>
                </td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    client.balance < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatValue(client.balance)}
                </td>
              </tr>
            ))}

            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* modal */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={
                    selectedClient?.urlImage ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4pTaa9fW0mgaMx_klIjmYFY5D-bnqvXPI33h5O4nAM2cPzzqBbU4eGhAFU7vhm2pSCyM&usqp=CAU"
                  }
                />
                <AvatarFallback>{selectedClient?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div>{selectedClient?.name}</div>
                <div className="text-sm font-normal text-gray-600">
                  {selectedClient?.document || "Sem documento"}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedClient ? (
            <div className="mt-2 space-y-4">
              {/* Informações principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">ID</p>
                  <p className="font-medium text-lg">#{selectedClient.id}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Saldo</p>
                  <p
                    className={`font-semibold text-lg ${
                      selectedClient.balance < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {formatValue(selectedClient.balance)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Transações</p>
                  <p className="font-medium text-lg">{selectedClient.transactions}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Última mov.</p>
                  <p className="font-medium text-sm">
                    {selectedClient.date ? new Date(selectedClient.date).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>

              {/* Categoria e Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Categoria Principal</p>

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedClient.category === 'Alimentação' ? 'bg-green-100 text-green-800' :
                    selectedClient.category === 'Tabacaria' ? 'bg-red-100 text-red-800' :
                    selectedClient.category === 'Educação' ? 'bg-blue-100 text-blue-800' :
                    selectedClient.category === 'Saúde' ? 'bg-pink-100 text-pink-800' :
                    selectedClient.category === 'Combustível' ? 'bg-orange-100 text-orange-800' :
                    selectedClient.category === 'Vestuário' ? 'bg-purple-100 text-purple-800' :
                    selectedClient.category === 'Construção' ? 'bg-yellow-100 text-yellow-800' :
                    selectedClient.category === 'Transporte' ? 'bg-indigo-100 text-indigo-800' :
                    selectedClient.category === 'Serviços Públicos' ? 'bg-gray-100 text-gray-800' :
                    selectedClient.category === 'Tecnologia' ? 'bg-cyan-100 text-cyan-800' :
                    selectedClient.category === 'Entretenimento' ? 'bg-amber-100 text-amber-800' :
                    selectedClient.category === 'Serviços Financeiros' ? 'bg-emerald-100 text-emerald-800' :
                    selectedClient.category === 'Transferência Pessoal' ? 'bg-violet-100 text-violet-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedClient.category}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipo de Transferência</p>
                  {selectedClient.transferType ? (
                    <span className="px-3 py-2 rounded-full text-sm bg-orange-100 text-orange-800 font-medium">
                      {selectedClient.transferType}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">Não aplicável</span>
                  )}
                </div>
              </div>

              {/* Transações relacionadas */}
              <div>
                <h4 className="font-semibold mb-3">Transações Relacionadas</h4>
                <div className="border rounded-lg overflow-hidden">
                  {clientTransactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      Nenhuma transação encontrada.
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Data</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Descrição</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Categoria</th>
                            <th className="px-4 py-2 text-right font-medium text-gray-700">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {clientTransactions.map((t, idx) => {
                            const amount = Number(t.amount) || 0;
                            const isIncome = amount > 0;
                            return (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {new Date(t.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2">
                                  <div className="font-medium">{t.description}</div>
                                  {t.category && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {t.category}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {t.category && (
                                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                      {t.category}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-right">
                                  <span
                                    className={`font-semibold ${
                                      isIncome ? "text-green-600" : "text-red-600"
                                    }`}
                                  >
                                    {formatValue(amount)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>Carregando...</p>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}