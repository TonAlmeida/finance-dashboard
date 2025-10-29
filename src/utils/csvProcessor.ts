// csvProcessor.ts

import { ChartData } from "@/types/barChartData";
import { DashboardData } from "@/types/dashboardData";
import { ProcessedData } from "@/types/processedData";
import { Transaction } from "@/types/transaction";

export class CSVProcessor {
  static processCSVFiles(files: File[]): Promise<ProcessedData> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!files || files.length === 0) {
          throw new Error('Nenhum arquivo selecionado');
        }

        const allTransactions: Transaction[] = [];
        
        // Processar cada arquivo
        for (const file of files) {
          const fileData = await this.readFile(file);
          const parsedData = this.parseCSV(fileData);
          const transactions = this.processFileData(parsedData);
          allTransactions.push(...transactions);
        }

        // Ordenar transações por data (mais recente primeiro)
        const sortedTransactions = allTransactions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Gerar dados
        const chartData = this.generateChartData(allTransactions);
        const dashboardData = this.calculateDashboardMetrics(allTransactions);
        const transactionsList = this.generateTransactionList(sortedTransactions);

        resolve({
          dashboard: dashboardData,
          chartData,
          transactions: transactionsList
        });

      } catch (error) {
        reject(error);
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

  private static processFileData(fileData: any[]): Transaction[] {
    return fileData.map(row => {
      const amount = parseFloat(row.Valor);
      const description = row.Descrição || '';
      
      const type = amount >= 0 ? 'income' : 'expense';
      const absoluteAmount = Math.abs(amount);
      
      const category = this.categorizeTransaction(description);
      
      // Converter data para formato YYYY-MM-DD
      const dateParts = row.Data.split('/');
      const formattedDate = `20${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
      
      return {
        id: row.Identificador,
        date: formattedDate,
        description: description,
        category: category,
        type: type,
        amount: type === 'income' ? absoluteAmount : -absoluteAmount,
      };
    });
  }

  private static categorizeTransaction(description: string): string {
    const desc = description.toLowerCase();
    
    if (desc.includes('recebida') || desc.includes('recebido') || desc.includes('pagamento recebido')) {
      return 'Renda';
    }
    
    if (desc.includes('supermercado') || desc.includes('mercado') || desc.includes('aliment') || 
        desc.includes('padaria') || desc.includes('panificadora') || desc.includes('açaí') ||
        desc.includes('hot dog') || desc.includes('culinaria') || desc.includes('sabor') ||
        desc.includes('atacadão') || desc.includes('atacadao')) {
      return 'Alimentação';
    }
    
    if (desc.includes('posto') || desc.includes('combustível') || desc.includes('gasolina')) {
      return 'Transporte';
    }
    
    if (desc.includes('farmácia') || desc.includes('farmacia') || desc.includes('pague menos') || 
        desc.includes('ótica') || desc.includes('otica')) {
      return 'Saúde';
    }
    
    if (desc.includes('papelaria') || desc.includes('livraria') || desc.includes('material')) {
      return 'Educação';
    }
    
    if (desc.includes('transferência') || desc.includes('pix')) {
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
          month: monthName,
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
    
    // Converter para array e ordenar por data
    return Object.values(monthlyData)
      .sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  }

  private static generateTransactionList(transactions: Transaction[]): Transaction[] {
    return transactions.map(transaction => ({
      ...transaction,
      description: transaction.description.length > 50 
        ? transaction.description.substring(0, 50) + '...' 
        : transaction.description
    }));
  }

  private static calculateDashboardMetrics(transactions: Transaction[]): DashboardData {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += Math.abs(transaction.amount);
      } else {
        totalExpenses += Math.abs(transaction.amount);
      }
    });

    const transactionCount = transactions.length;
    const balance = totalIncome - totalExpenses;
    const averageTransaction = transactionCount > 0 
      ? (totalIncome + totalExpenses) / transactionCount 
      : 0;

    return {
      balance,
      totalIncome,
      totalExpenses,
      transactionCount,
      averageTransaction: Number(averageTransaction.toFixed(2))
    };
  }
}