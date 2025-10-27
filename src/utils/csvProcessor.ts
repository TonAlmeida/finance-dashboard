// csvProcessor.ts

import { ChartData } from "@/types/chartData";
import { DashboardData } from "@/types/dashboardData";
import { ProcessedData } from "@/types/processedData";
import { Transaction } from "@/types/transaction";

interface ClientInfo {
  id: string;
  name: string;
  document: string;
  transactionCount: number;
  totalAmount: number;
  lastTransaction: string;
  categories: string[];
}

export class CSVProcessor {
  static processCSVFiles(files: File[]): Promise<ProcessedData> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!files || files.length === 0) {
          throw new Error('Nenhum arquivo selecionado');
        }

        const allTransactions: Transaction[] = [];
        const processedKeys = new Set<string>();
        const clientRegistry = new Map<string, string>(); // CPF/CNPJ -> Nome padronizado
        
        // Processar cada arquivo
        for (const file of files) {
          const fileData = await this.readFile(file);
          const parsedData = this.parseCSV(fileData);
          const transactions = this.processFileData(parsedData, processedKeys, file.name, clientRegistry);
          allTransactions.push(...transactions);
        }

        // Verificar se há IDs duplicados
        const duplicateIds = this.findDuplicateIds(allTransactions);
        if (duplicateIds.length > 0) {
          console.warn('IDs duplicados encontrados:', duplicateIds);
          this.fixDuplicateIds(allTransactions);
        }

        // Ordenar transações por data (mais recente primeiro)
        const sortedTransactions = allTransactions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Gerar dados
        const chartData = this.generateChartData(allTransactions);
        const dashboardData = this.calculateDashboardMetrics(allTransactions);
        const transactionsList = this.generateTransactionList(sortedTransactions);
        const clientsData = this.generateClientsData(allTransactions);

        resolve({
          dashboard: dashboardData,
          chartData,
          transactions: transactionsList,
          clients: clientsData
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  private static findDuplicateIds(transactions: Transaction[]): string[] {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    
    transactions.forEach(transaction => {
      if (seen.has(transaction.id)) {
        duplicates.push(transaction.id);
      } else {
        seen.add(transaction.id);
      }
    });
    
    return duplicates;
  }

  private static fixDuplicateIds(transactions: Transaction[]): void {
    const idCount = new Map<string, number>();
    
    transactions.forEach(transaction => {
      const count = idCount.get(transaction.id) || 0;
      idCount.set(transaction.id, count + 1);
      
      if (count > 0) {
        transaction.id = `${transaction.id}-${count + 1}`;
      }
    });
  }

  private static readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  private static parseCSV(csvContent: string): any[] {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] ? values[index].trim() : '';
      });
      
      data.push(row);
    }
    
    return data;
  }

  private static parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current);
    return values;
  }

  private static processFileData(
    fileData: any[], 
    processedKeys: Set<string>,
    fileName: string,
    clientRegistry: Map<string, string>
  ): Transaction[] {
    const transactions: Transaction[] = [];

    for (const row of fileData) {
      const amount = parseFloat(row.Valor || row.valor || row.amount || '0');
      if (isNaN(amount)) continue;

      const description = row.Descrição || row.descricao || row.description || '';
      
      // Extrair informações do cliente
      const clientInfo = this.extractClientInfo(row, description, clientRegistry);
      
      // Gerar ID único para esta transação
      const uniqueId = this.generateUniqueId(row, fileName, processedKeys);
      
      const type = amount >= 0 ? 'income' : 'expense';
      const absoluteAmount = Math.abs(amount);
      
      const category = this.categorizeTransaction(description, amount);
      
      // Converter data para formato YYYY-MM-DD
      const formattedDate = this.parseDate(row.Data || row.data || row.date);
      
      transactions.push({
        id: uniqueId,
        date: formattedDate,
        description: description,
        category: category,
        type: type,
        amount: type === 'income' ? absoluteAmount : -absoluteAmount,
        document: clientInfo.document,
        counterpartName: clientInfo.name,
        transactionMethod: this.extractTransactionMethod(row, description),
        clientId: clientInfo.clientId
      });
    }
    
    return transactions;
  }

  private static extractClientInfo(
    row: any, 
    description: string, 
    clientRegistry: Map<string, string>
  ): { 
    document: string; 
    name: string; 
    clientId: string;
  } {
    // Extrair número do documento
    const document = this.extractDocumentNumber(row, description);
    
    // Extrair nome da contraparte
    const rawName = this.extractCounterpartyName(row, description);
    
    // Padronizar nome do cliente
    const standardizedName = this.standardizeClientName(rawName, document);
    
    // Criar ou recuperar clientId
    let clientId: string;
    if (document && document !== 'unknown') {
      clientId = document;
      // Registrar no registry
      if (!clientRegistry.has(document)) {
        clientRegistry.set(document, standardizedName);
      }
    } else {
      // Se não tem documento, usar nome como base
      clientId = this.createHash(standardizedName);
      if (!clientRegistry.has(clientId)) {
        clientRegistry.set(clientId, standardizedName);
      }
    }

    return {
      document,
      name: standardizedName,
      clientId
    };
  }

  private static standardizeClientName(rawName: string, document: string): string {
    if (!rawName || rawName === 'Não identificado') {
      return document && document !== 'unknown' 
        ? `Cliente ${document}` 
        : 'Cliente não identificado';
    }

    // Limpar e padronizar nome
    let name = rawName
      .replace(/[^\w\sÀ-ÿ]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();

    // Remover palavras comuns
    const commonWords = [
      'LTDA', 'ME', 'EPP', 'SA', 'S/A', 'EIRELI', 'COMERCIO', 'COMÉRCIO',
      'SERVICOS', 'SERVIÇOS', 'PAGAMENTO', 'RECEBIMENTO', 'TRANSFERÊNCIA', 
      'TRANSFERENCIA', 'PIX', 'TED', 'DOC'
    ];

    name = name.split(' ')
      .filter(word => {
        const cleanWord = word.replace(/[^A-Z]/gi, '');
        return cleanWord.length > 2 && !commonWords.includes(cleanWord);
      })
      .join(' ');

    return name || (document && document !== 'unknown' ? `Cliente ${document}` : 'Cliente não identificado');
  }

  private static extractDocumentNumber(row: any, description: string): string {
    const possibleFields = [
      'Documento', 'documento', 'Número Documento', 'numero_documento',
      'Doc', 'doc', 'CPF', 'CNPJ', 'Identificador', 'identificador'
    ];

    for (const field of possibleFields) {
      if (row[field] && row[field].toString().trim() !== '') {
        return this.cleanDocumentNumber(row[field].toString().trim());
      }
    }

    // Tentar extrair da descrição
    const docFromDescription = this.extractDocumentFromDescription(description);
    if (docFromDescription) return docFromDescription;

    return 'unknown';
  }

  private static extractDocumentFromDescription(description: string): string {
    const patterns = [
      /(\d{3}\.\d{3}\.\d{3}-\d{2})/, // CPF formatado
      /(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/, // CNPJ formatado
      /(\d{11})/, // CPF sem formatação
      /(\d{14})/ // CNPJ sem formatação
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match) {
        return this.cleanDocumentNumber(match[1]);
      }
    }

    return '';
  }

  private static cleanDocumentNumber(doc: string): string {
    return doc.replace(/\D/g, ''); // Remove não dígitos
  }

  private static extractCounterpartyName(row: any, description: string): string {
    const possibleFields = [
      'Nome', 'nome', 'Counterparty', 'counterparty', 'Parte', 'parte',
      'Favorecido', 'favorecido', 'Beneficiário', 'beneficiario',
      'Cliente', 'cliente', 'Fornecedor', 'fornecedor'
    ];

    for (const field of possibleFields) {
      if (row[field] && row[field].toString().trim() !== '') {
        return row[field].toString().trim();
      }
    }

    // Tentar extrair nome da descrição
    return this.extractNameFromDescription(description);
  }

  private static extractNameFromDescription(description: string): string {
    let cleanDesc = description
      .replace(/(PIX|TED|DOC|TRANSF|TRANSFERÊNCIA|PGTO|RECEB)\s*/gi, '')
      .replace(/\d{2,}/g, ' ')
      .replace(/[^\w\sÀ-ÿ]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleanDesc.split(' ').filter(word => 
      word.length > 2 && 
      !word.match(/^\d+$/) &&
      !this.isCommonTransactionWord(word)
    );

    return words.join(' ') || 'Não identificado';
  }

  private static isCommonTransactionWord(word: string): boolean {
    const commonWords = [
      'pagamento', 'recebimento', 'transferencia', 'de', 'para', 'por',
      'banco', 'conta', 'cartao', 'credito', 'debito'
    ];
    return commonWords.includes(word.toLowerCase());
  }

  private static generateUniqueId(row: any, fileName: string, processedKeys: Set<string>): string {
    const dataString = [
      row.Documento || row.documento || '',
      row.Identificador || row.identificador || '',
      row.Data || row.data || row.date || '',
      row.Valor || row.valor || row.amount || '',
      row.Descrição || row.descricao || row.description || '',
      fileName,
      Date.now().toString(),
      Math.random().toString(36).substring(2, 15)
    ].join('|');

    return this.createHash(dataString);
  }

  private static createHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36) + '-' + Date.now().toString(36);
  }

  private static extractTransactionMethod(row: any, description: string): string {
    const desc = description.toLowerCase();
    
    if (desc.includes('pix')) return 'PIX';
    if (desc.includes('ted')) return 'TED';
    if (desc.includes('doc')) return 'DOC';
    if (desc.includes('transferência') || desc.includes('transferencia')) return 'Transferência';
    if (desc.includes('débito') || desc.includes('debito')) return 'Débito';
    if (desc.includes('crédito') || desc.includes('credito')) return 'Crédito';
    if (desc.includes('boleto')) return 'Boleto';
    if (desc.includes('dinheiro')) return 'Dinheiro';
    
    const methodField = row.Método || row.metodo || row.Forma || row.forma;
    if (methodField) return methodField.toString().trim();
    
    return 'Outros';
  }

  private static parseDate(dateString: string): string {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    const formats = [
      /^(\d{2})\/(\d{2})\/(\d{4})$/,
      /^(\d{2})\/(\d{2})\/(\d{2})$/,
      /^(\d{4})-(\d{2})-(\d{2})$/,
      /^(\d{2})-(\d{2})-(\d{4})$/
    ];

    for (const format of formats) {
      const match = dateString.match(format);
      if (match) {
        if (format === formats[0]) {
          return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
        } else if (format === formats[1]) {
          const year = parseInt(match[3]) < 50 ? `20${match[3]}` : `19${match[3]}`;
          return `${year}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
        } else if (format === formats[2]) {
          return dateString;
        } else if (format === formats[3]) {
          return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
        }
      }
    }

    return new Date().toISOString().split('T')[0];
  }

  private static categorizeTransaction(description: string, amount: number): string {
    const desc = description.toLowerCase();
    
    if (amount >= 0 || desc.includes('recebida') || desc.includes('recebido') || 
        desc.includes('pagamento recebido') || desc.includes('salário') || 
        desc.includes('salario') || desc.includes('renda')) {
      return 'Renda';
    }
    
    if (desc.includes('supermercado') || desc.includes('mercado') || desc.includes('aliment') || 
        desc.includes('padaria') || desc.includes('restaurante') || desc.includes('lanchonete')) {
      return 'Alimentação';
    }
    
    if (desc.includes('posto') || desc.includes('combustível') || desc.includes('gasolina') ||
        desc.includes('uber') || desc.includes('99') || desc.includes('taxi') || 
        desc.includes('transporte')) {
      return 'Transporte';
    }
    
    if (desc.includes('farmácia') || desc.includes('farmacia') || desc.includes('hospital') ||
        desc.includes('médico') || desc.includes('medico') || desc.includes('plano de saúde')) {
      return 'Saúde';
    }
    
    if (desc.includes('papelaria') || desc.includes('livraria') || desc.includes('material') ||
        desc.includes('curso') || desc.includes('faculdade') || desc.includes('universidade')) {
      return 'Educação';
    }
    
    if (desc.includes('luz') || desc.includes('energia') || desc.includes('água') || 
        desc.includes('agua') || desc.includes('internet') || desc.includes('telefone')) {
      return 'Utilidades';
    }
    
    if (desc.includes('transferência') || desc.includes('pix') || desc.includes('ted') || 
        desc.includes('doc')) {
      return 'Transferência';
    }
    
    return 'Outros';
  }

  private static generateChartData(transactions: Transaction[]): ChartData[] {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    
    const monthlyData: { [key: string]: ChartData } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];
      const year = date.getFullYear();
      
      const key = `${year}-${monthIndex}`;
      
      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: `${monthName}/${year}`,
          income: 0,
          expenses: 0
        };
      }
      
      if (transaction.type === 'income') {
        monthlyData[key].income += Math.abs(transaction.amount);
      } else {
        monthlyData[key].expenses += Math.abs(transaction.amount);
      }
    });
    
    return Object.values(monthlyData)
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split('/');
        const [bMonth, bYear] = b.month.split('/');
        const aDate = new Date(parseInt(aYear), months.indexOf(aMonth));
        const bDate = new Date(parseInt(bYear), months.indexOf(bMonth));
        return aDate.getTime() - bDate.getTime();
      });
  }

  private static generateTransactionList(transactions: Transaction[]): Transaction[] {
    return transactions.map(transaction => ({
      ...transaction,
      description: transaction.description.length > 50 
        ? transaction.description.substring(0, 50) + '...' 
        : transaction.description
    }));
  }

  private static generateClientsData(transactions: Transaction[]): ClientInfo[] {
    const clientsMap = new Map<string, ClientInfo>();

    transactions.forEach(transaction => {
      if (!transaction.id) return;

      const clientId = transaction.id;
      
      if (!clientsMap.has(clientId)) {
        clientsMap.set(clientId, {
          id: clientId,
          name: transaction.counterpartName,
          document: transaction.document,
          transactionCount: 0,
          totalAmount: 0,
          lastTransaction: transaction.date,
          categories: []
        });
      }

      const client = clientsMap.get(clientId)!;
      client.transactionCount++;
      client.totalAmount += Math.abs(transaction.amount);
      
      // Adicionar categoria se não existir
      if (!client.categories.includes(transaction.category)) {
        client.categories.push(transaction.category);
      }
      
      // Atualizar última transação
      if (new Date(transaction.date) > new Date(client.lastTransaction)) {
        client.lastTransaction = transaction.date;
      }
    });

    return Array.from(clientsMap.values())
      .sort((a, b) => b.transactionCount - a.transactionCount);
  }

  private static calculateDashboardMetrics(transactions: Transaction[]): DashboardData {
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown: { [key: string]: number } = {};

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += Math.abs(transaction.amount);
      } else {
        totalExpenses += Math.abs(transaction.amount);
        const category = transaction.category;
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + Math.abs(transaction.amount);
      }
    });

    const transactionCount = transactions.length;
    const balance = totalIncome - totalExpenses;
    const averageTransaction = transactionCount > 0 
      ? (totalIncome + totalExpenses) / transactionCount 
      : 0;

    const topCategory = Object.keys(categoryBreakdown).reduce((max, category) => {
      return categoryBreakdown[category] > (categoryBreakdown[max] || 0) ? category : max;
    }, 'Outros');

    return {
      balance,
      totalIncome,
      totalExpenses,
      transactionCount,
      averageTransaction: Number(averageTransaction.toFixed(2)),
      topSpendingCategory: topCategory,
      categoryBreakdown
    };
  }
}