import { useState } from 'react';
import { CsvProcessor } from '@/utils/CsvProcessor';
import { TransactionData } from '@/types/TransactionData';

interface FileUploadProps {
  transactions: TransactionData[];
  setTransactions: React.Dispatch<React.SetStateAction<TransactionData[] | null>>;
  onSucess?: () => void;
}

export default function FileUpload({ transactions, setTransactions, onSucess }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    try {
      const fileArray = Array.from(files);
      const transactionsFromCsv = await CsvProcessor.processData(fileArray);

      //checking if has duplicated items in the data
      const transactionsSetIDs = new Set(transactions.map(i => i.id));
      const newItems = transactionsFromCsv.filter(item => !transactionsSetIDs.has(item.id));
      
      setTransactions([...transactions, ...newItems]);

      onSucess?.();
    } catch (erro) {
      console.log('Erro ao processar arquivos', erro);
    } finally {
      setIsProcessing(false);
    }
  };

  return (       
      <div className="flex justify-around items-center border-b-2 border-green-500 mb-4 py-4">
        <h3 className='hidden sm:block'>Importar arquivos CSVs</h3>
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