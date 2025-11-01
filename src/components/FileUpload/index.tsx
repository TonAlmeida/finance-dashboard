'use client';

import { useState } from 'react';
import { NuCsvProcessor } from '@/utils/NuCsvProcessor'; 
import { ProcessedData } from '@/types/processedData';
import { Card } from '../ui/card';

interface FileUploadProps {
  onDataProcessed: (data: ProcessedData) => void;
  onError: (error: string) => void;
  onSucess?: () => void;
}

export default function FileUpload({ onDataProcessed, onError, onSucess }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    try {
      const fileArray = Array.from(files);
      const processedData = await NuCsvProcessor.processData(fileArray);
      onDataProcessed(processedData);
      if(processedData) localStorage.setItem("data", JSON.stringify(processedData))
      onSucess?.();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erro ao processar arquivos');
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (       
      <div className="flex justify-around items-center w-full border-b-2 border-green-500 mb-4 py-4">
        <h3>Importar arquivos CSVs</h3>
        <input
          id='mainInput'
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileChange}
          disabled={isProcessing}
          style={{ appearance: 'none' }}
          className="text-sm p-3 text-gray-500 file:mr-0 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {isProcessing && (
          <p className="mt-2 text-sm text-gray-600">Processando arquivos...</p>
        )}
      </div>
  );
}