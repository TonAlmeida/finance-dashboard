"use client";

import { TransactionDataProvider } from "@/contexts/transactionsContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <TransactionDataProvider>{children}</TransactionDataProvider>;
}
