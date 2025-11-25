"use client";

import React, { useRef, useState } from "react";
import { CsvProcessor } from "@/utils/CsvProcessor";
import { TransactionData } from "@/types/TransactionData";

interface FileUploadProps {
  transactions: TransactionData[];
  setTransactions: React.Dispatch<React.SetStateAction<TransactionData[] | null>>;
  onSucess?: () => void;
}

export default function FileUpload({ transactions, setTransactions, onSucess }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [debugMode] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("[FileUpload] onChange files:", files);
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    try {
      const fileArray = Array.from(files);
      console.log("[FileUpload] selected file names:", fileArray.map(f => f.name));

      const transactionsFromCsv = await CsvProcessor.processData(fileArray);

      const transactionsSetIDs = new Set(transactions.map((i) => i.id));
      const newItems = transactionsFromCsv.filter((item) => !transactionsSetIDs.has(item.id));

      setTransactions([...transactions, ...newItems]);

      onSucess?.();
    } catch (erro) {
      console.log("Erro ao processar arquivos", erro);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleButtonClick = () => {
    if (!inputRef.current) return;

    try {
      inputRef.current.value = ""; 
      inputRef.current.click();
    } catch (e) {
      console.warn("[FileUpload] programmatic click falhou:", e);
    }
  };

  return (
    <div className="flex justify-around items-center border-b-2 border-green-500 mb-4 py-4">
      <h3 className="hidden sm:block">Importar arquivos CSVs</h3>

      <button
        type="button"
        aria-label="Selecionar CSVs"
        onClick={handleButtonClick}
        disabled={isProcessing}
        className="relative cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 text-sm"
      >
        {isProcessing ? "Processando..." : "Selecionar CSV(s)"}
      </button>

      <input
        ref={inputRef}
        id="mainInput"
        type="file"
        accept={debugMode ? "*/*" : "text/csv,.csv,application/vnd.ms-excel"}
        multiple
        onChange={handleFileChange}
        disabled={isProcessing}
        className="absolute opacity-0 pointer-events-none"
      />
    </div>
  );
}
