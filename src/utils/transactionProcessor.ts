import { Transaction } from "@/types/transaction";

export function processTransactions(rawTransactions: any[]): Transaction[] {
  return rawTransactions.map((tx, index) => {
    const amount = Number(tx.Valor) || 0;
    const description = tx.Descrição || '';
    
    // Extrair informações da descrição
    const { category, transferType, counterpartName, document } = extractTransactionInfo(description);
    
    return {
      id: tx.Identificador || `tx-${index}-${Date.now()}`,
      date: tx.Data || new Date().toISOString().split('T')[0],
      amount,
      description,
      type: amount >= 0 ? 'income' : 'expense',
      category,
      transferType,
      counterpartName,
      document,
      bank: extractBankFromDescription(description),
      identifier: tx.Identificador
    };
  });
}

function extractTransactionInfo(description: string): {
  category: string;
  transferType?: string;
  counterpartName?: string;
  document?: string;
} {
  const parts = description.split(" - ").map(p => p.trim());
  
  let category = "Outros";
  let transferType: string | undefined;
  let counterpartName: string | undefined;
  let document: string | undefined;

  // Determinar tipo de transação
  if (description.includes("Transferência enviada pelo Pix")) {
    transferType = "PIX Enviado";
    category = "Transferência";
  } else if (description.includes("Transferência Recebida") || description.includes("Transferência recebida pelo Pix")) {
    transferType = "PIX Recebido";
    category = "Transferência";
  } else if (description.includes("Compra no débito")) {
    transferType = "Débito";
    category = categorizeByBusiness(parts[1] || "");
  } else if (description.includes("Pagamento Recebido")) {
    transferType = "Recebimento";
    category = "Receita";
  } else if (description.includes("Pagamento de fatura")) {
    transferType = "Fatura";
    category = "Serviços Financeiros";
  } else if (description.includes("Tarifa")) {
    transferType = "Tarifa";
    category = "Serviços Financeiros";
  }

  // Extrair nome e documento
  if (parts.length >= 3) {
    counterpartName = parts[1];
    document = parts[2].replace(/[^\d.-]/g, "").trim();
  } else if (parts.length >= 2) {
    counterpartName = parts[1];
  }

  // Limpeza do nome
  if (counterpartName) {
    counterpartName = counterpartName.replace(/•{3}\.\d{3}\.\d{3}-•{2}/g, "")
                                     .replace(/•{2}\.\d{3}\.\d{3}\/\d{4}-•{2}/g, "")
                                     .replace(/\s+/g, " ")
                                     .trim();
  }

  // Se não categorizou ainda, categoriza por negócio
  if (category === "Outros" && counterpartName) {
    category = categorizeByBusiness(counterpartName, description);
  }

  return { category, transferType, counterpartName, document };
}

function categorizeByBusiness(name: string, description: string = ""): string {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();

  if (lowerName.includes('panificadora') || lowerName.includes('padaria') || lowerDesc.includes('aliment')) 
    return "Alimentação";
  if (lowerName.includes('tabacaria') || lowerName.includes('tabaco')) 
    return "Tabacaria";
  if (lowerName.includes('escola') || lowerName.includes('educação') || lowerName.includes('material escolar')) 
    return "Educação";
  if (lowerName.includes('farmacia') || lowerName.includes('farmácia') || lowerName.includes('drogaria')) 
    return "Saúde";
  if (lowerName.includes('posto') || lowerName.includes('combustível')) 
    return "Combustível";
  if (lowerName.includes('supermercado') || lowerName.includes('mercado') || lowerName.includes('atacadão')) 
    return "Mercado";
  if (lowerName.includes('restaurante') || lowerName.includes('lanchonete') || lowerName.includes('bar')) 
    return "Alimentação Externa";
  
  return "Outros";
}

function extractBankFromDescription(description: string): string {
  if (description.includes("NU PAGAMENTOS") || description.includes("Nubank")) return "Nubank";
  if (description.includes("BCO BRADESCO")) return "Bradesco";
  if (description.includes("BCO SANTANDER")) return "Santander";
  if (description.includes("BCO DO BRASIL")) return "Banco do Brasil";
  if (description.includes("CAIXA ECONOMICA")) return "Caixa";
  if (description.includes("ITAU")) return "Itaú";
  if (description.includes("MERCADO PAGO")) return "Mercado Pago";
  if (description.includes("PICPAY")) return "PicPay";
  return "Outro";
}