// components/FileUpload.tsx
'use client';

import { useState } from 'react';
import { CSVProcessor } from '@/utils/csvProcessor';
import { ProcessedData } from '@/types/processedData';

interface FileUploadProps {
  onDataProcessed: (data: ProcessedData) => void;
  onError: (error: string) => void;
}

export default function FileUpload({ onDataProcessed, onError }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    try {
      const fileArray = Array.from(files);
      const processedData = await CSVProcessor.processCSVFiles(fileArray);
      onDataProcessed(processedData);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erro ao processar arquivos');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-between items-center py-2 px-4 w-full">
      <h1 className='hidden sm:flex sm:text-2xl'>Risoflora Finance</h1>
      <input
        id='mainInput'
        type="file"
        accept=".csv"
        multiple
        onChange={handleFileChange}
        disabled={isProcessing}
        style={{ appearance: 'none' }}
        className="text-sm text-gray-500 file:mr-0 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {isProcessing && (
        <p className="mt-2 text-sm text-gray-600">Processando arquivos...</p>
      )}
    </div>
  );
}