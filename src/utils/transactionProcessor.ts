// utils/transactionProcessor.ts
import { Transaction, CSVRow } from '@/types/transaction';

export function processCSVToTransactions(csvFiles: string[]): Transaction[] {
  const transactions: Transaction[] = [];
  
  csvFiles.forEach((file: string) => {
    const lines = file.split('\n');
    
    // Pular linha de cabeçalho e processar cada linha
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = parseCSVLine(lines[i]);
      if (values.length < 4) continue;
      
      try {
        const transaction = createTransactionFromRow(values);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn('Erro ao processar linha:', lines[i], error);
      }
    }
  });
  
  // Ordenar por data (mais recente primeiro)
  return transactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Função para parsear linha CSV considerando vírgulas na descrição
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Adicionar o último campo
  result.push(current.trim());
  return result;
}

// Função para criar transação a partir de uma linha
function createTransactionFromRow(values: string[]): Transaction | null {
  const [data, valor, identificador, descricao] = values;
  
  const amount = parseFloat(valor.trim());
  if (isNaN(amount)) return null;
  
  const type: 'income' | 'expense' = amount > 0 ? 'income' : 'expense';
  const category = categorizeTransaction(descricao.trim());
  
  return {
    date: formatDate(data.trim()),
    amount: Math.abs(amount), // Valor absoluto para facilitar
    id: identificador.trim(),
    description: descricao.trim(),
    type,
    category
  };
}

// Função para categorizar transações baseada na descrição
function categorizeTransaction(description: string): string {
  const desc = description.toLowerCase();
  
  if (desc.includes('transferência enviada')) return 'transfer_out';
  if (desc.includes('reembolso')) return 'refund';
  if (desc.includes('compra no débito')) return 'purchase';
  if (desc.includes('supermercado') || desc.includes('mercado')) return 'groceries';
  if (desc.includes('padaria') || desc.includes('panificadora')) return 'bakery';
  if (desc.includes('restaurante') || desc.includes('lanchonete') || desc.includes('acaiteria')) return 'food';
  if (desc.includes('farmácia') || desc.includes('farmacia') || desc.includes('utifarma')) return 'pharmacy';
  if (desc.includes('transporte') || desc.includes('uber') || desc.includes('taxi')) return 'transport';
  if (desc.includes('luz') || desc.includes('água') || desc.includes('agua') || desc.includes('energia')) return 'utilities';
  
  return 'other';
}

// Função para formatar data (DD/MM/YYYY para YYYY-MM-DD)
function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Função para ler arquivos (já existente)
export function readFilesAsText(files: File[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const csvFiles: string[] = [];
    let filesProcessed = 0;
    
    if (files.length === 0) {
      resolve([]);
      return;
    }
    
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      
      reader.onload = function(e: ProgressEvent<FileReader>) {
        if (e.target?.result) {
          csvFiles.push(e.target.result as string);
          filesProcessed++;
          
          if (filesProcessed === files.length) {
            resolve(csvFiles);
          }
        }
      };
      
      reader.onerror = function() {
        reject(new Error(`Erro ao ler o arquivo: ${files[i].name}`));
      };
      
      reader.readAsText(files[i]);
    }
  });
}