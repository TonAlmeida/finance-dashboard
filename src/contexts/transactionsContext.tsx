'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TransactionData } from '@/types/TransactionData';

type TransactionsContextType = {
  transactionsData: TransactionData[] | null;
  setTransactionsData: React.Dispatch<React.SetStateAction<TransactionData[] | null>>;
};

const TransactionsDataContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactionsData, setTransactionsData] = useState<TransactionData[] | null>(null);

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactionsData(savedTransactions);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactionsData))
  }, [transactionsData]);

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
