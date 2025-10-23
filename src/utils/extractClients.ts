import { Transaction } from '@/types/transaction';
import { Client } from '@/types/client';

function extractCounterpart(description: string): string {
  const parts = description.split(" - ");
  return parts[1]?.trim() ?? "Desconhecido";
}

export function generateClients(transactions: Transaction[]): Client[] {
  const clientsMap = new Map<string, Client>();

  transactions.forEach((t) => {
    const displayName = extractCounterpart(t.description);
    const keyName = displayName.toLowerCase();

    let delta = 0;
    delta += t.amount;

    if (clientsMap.has(keyName)) {
      const existing = clientsMap.get(keyName)!;
      existing.transactions += 1;
      existing.balance += delta;
      if (new Date(t.date) > existing.date) {
        existing.date = new Date(t.date);
      }
    } else {
      clientsMap.set(keyName, {
        id: clientsMap.size + 1,
        name: displayName,
        date: new Date(t.date),
        transactions: 1,
        balance: delta,
      });
    }

    console.log(t.description, t.type, t.amount, delta);

  });

  return Array.from(clientsMap.values());
}
