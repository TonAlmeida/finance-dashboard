"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatValue } from "@/utils/formatValue";
import { useEffect, useState, useMemo } from "react";
import { ProcessedData } from "@/types/processedData";
import { Client } from "@/types/client";
import { generateClients } from "@/utils/extractClients";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "positive" | "negative">("all");
  const [minTransactions, setMinTransactions] = useState<number>(0);

  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      try {
        const parsedData: ProcessedData = JSON.parse(storedData);
        const clientsList = generateClients(parsedData.transactions || []);
        setClients(clientsList);
      } catch (e) {
        console.error("Erro ao parsear o localStorage", e);
      }
    }
  }, []);

  const filteredClients = useMemo(() => {
    return clients
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      .filter((c) => {
        if (filterType === "positive") return c.balance > 0;
        if (filterType === "negative") return c.balance < 0;
        return true;
      })
      .filter((c) => c.transactions >= minTransactions);
  }, [clients, search, filterType, minTransactions]);

  return (
    <main className="sm:ml-14 p-4">
      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-2 items-center">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">Todos os saldos</option>
            <option value="positive">Saldo positivo</option>
            <option value="negative">Saldo negativo</option>
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

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700"></th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">ID da parte</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Nome</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Data de Criação</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Transações</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2">
                  <Avatar>
                    <AvatarImage src={client.urlImage ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4pTaa9fW0mgaMx_klIjmYFY5D-bnqvXPI33h5O4nAM2cPzzqBbU4eGhAFU7vhm2pSCyM&usqp=CAU"} />
                    <AvatarFallback>{client.name.slice(0, 3)}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 py-2">#{client.id}</td>
                <td className="px-4 py-2">{client.name}</td>
                <td className="px-4 py-2">{client.date.toLocaleDateString()}</td>
                <td className="px-4 py-2">{client.transactions}</td>
                <td className={`px-4 py-2 font-semibold ${client.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                  {formatValue(client.balance)}
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
    </main>
  );
}
