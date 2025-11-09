'use client'

import React, { createContext, useContext, useState } from 'react';
import { NuTransactionData } from '@/types/NuTransactionData';

type TransactionsContextType = {
  transactionsData: NuTransactionData[] | null;
  setTransactionsData: React.Dispatch<React.SetStateAction<NuTransactionData[] | null>>;
};

const TransactionsDataContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactionsData, setTransactionsData] = useState<NuTransactionData[] | null>(null);

  return (
    <TransactionsDataContext.Provider value={{ transactionsData, setTransactionsData }}>
      {children}
    </TransactionsDataContext.Provider>
  );
};

export function useTransitions() {
  const context = useContext(TransactionsDataContext);
  if (!context) {
    throw new Error('useTransitions deve ser usado dentro de um TransactionDataProvider');
  }
  return context;
}
