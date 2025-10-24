// src/utils/extractClients.ts
import { Transaction } from "@/types/transaction";
import { Client } from "@/types/client";

// Função para categorizar por tipo de negócio/segmento
function categorizeByBusiness(name: string, description: string): string {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();

  // Alimentação
  if (lowerName.includes('panificadora') || lowerName.includes('padaria') || 
      lowerName.includes('restaurante') || lowerName.includes('lanchonete') ||
      lowerName.includes('acaiteria') || lowerName.includes('sorveteria') ||
      lowerName.includes('hot dog') || lowerName.includes('sabor') ||
      lowerName.includes('culinaria') || lowerDesc.includes('aliment') ||
      lowerName.includes('mercado') || lowerName.includes('supermercado') ||
      lowerName.includes('atacadão') || lowerName.includes('hortifruti')) {
    return "Alimentação";
  }

  // Tabacaria
  if (lowerName.includes('tabacaria') || lowerName.includes('tabaco') ||
      lowerName.includes('cigarro') || lowerName.includes('fumo')) {
    return "Tabacaria";
  }

  // Educação/Estudo
  if (lowerName.includes('escola') || lowerName.includes('colégio') ||
      lowerName.includes('universidade') || lowerName.includes('faculdade') ||
      lowerName.includes('curso') || lowerName.includes('estudo') ||
      lowerName.includes('educação') || lowerName.includes('educacao') ||
      lowerName.includes('material escolar') || lowerName.includes('papelaria') ||
      lowerName.includes('consorcio escolar')) {
    return "Educação";
  }

  // Saúde
  if (lowerName.includes('farmacia') || lowerName.includes('farmácia') ||
      lowerName.includes('drogaria') || lowerName.includes('medicamento') ||
      lowerName.includes('posto de saúde') || lowerName.includes('hospital') ||
      lowerName.includes('clínica') || lowerName.includes('pague menos')) {
    return "Saúde";
  }

  // Combustível
  if (lowerName.includes('posto') || lowerName.includes('combustível') ||
      lowerName.includes('gasolina') || lowerName.includes('petróleo') ||
      lowerName.includes('petroleo')) {
    return "Combustível";
  }

  // Vestuário
  if (lowerName.includes('loja de roupa') || lowerName.includes('vestuário') ||
      lowerName.includes('confecção') || lowerName.includes('moda') ||
      lowerName.includes('calçados') || lowerName.includes('roupas')) {
    return "Vestuário";
  }

  // Construção/Materiais
  if (lowerName.includes('construção') || lowerName.includes('construcao') ||
      lowerName.includes('material de construção') || lowerName.includes('ferragem') ||
      lowerName.includes('madeireira') || lowerName.includes('tijolo') ||
      lowerName.includes('cimento') || lowerName.includes('engenharia')) {
    return "Construção";
  }

  // Transporte
  if (lowerName.includes('transporte') || lowerName.includes('ônibus') ||
      lowerName.includes('onibus') || lowerName.includes('taxi') ||
      lowerName.includes('uber') || lowerName.includes('viagem')) {
    return "Transporte";
  }

  // Serviços Públicos
  if (lowerName.includes('prefeitura') || lowerName.includes('município') ||
      lowerName.includes('governo') || lowerName.includes('fpm') ||
      lowerName.includes('conta de luz') || lowerName.includes('conta de água') ||
      lowerName.includes('energia') || lowerName.includes('água')) {
    return "Serviços Públicos";
  }

  // Tecnologia
  if (lowerName.includes('celular') || lowerName.includes('informática') ||
      lowerName.includes('computador') || lowerName.includes('internet') ||
      lowerName.includes('vivo') || lowerName.includes('claro') ||
      lowerName.includes('tim') || lowerName.includes('oi')) {
    return "Tecnologia";
  }

  // Entretenimento
  if (lowerName.includes('cinema') || lowerName.includes('shopping') ||
      lowerName.includes('parque') || lowerName.includes('diversão') ||
      lowerName.includes('lazer') || lowerName.includes('bar') ||
      lowerName.includes('boate')) {
    return "Entretenimento";
  }

  // Serviços Financeiros
  if (lowerName.includes('banco') || lowerName.includes('financeira') ||
      lowerName.includes('crédito') || lowerName.includes('credito') ||
      lowerName.includes('investimento') || lowerName.includes('fii') ||
      lowerName.includes('tarifa') || lowerName.includes('pagamento')) {
    return "Serviços Financeiros";
  }

  // Transferências Pessoais
  if (description.includes('Transferência enviada pelo Pix') && 
      !lowerName.includes('banco') && !lowerName.includes('financeira') &&
      !lowerName.includes('empresa') && !lowerName.includes('ltda') &&
      !lowerName.includes('comércio') && !lowerName.includes('comercio')) {
    return "Transferência Pessoal";
  }

  return "Outros";
}

// Função para extrair nome, documento e categoria
function extractCounterpart(description: string): { 
  name: string; 
  document?: string;
  category: string;
  transferType?: string;
} {
  const parts = description.split(" - ").map((p) => p.trim());
  
  let name = "Desconhecido";
  let document: string | undefined = undefined;
  let category = "Outros";
  let transferType: string | undefined = undefined;

  // Identificar tipo de transação
  if (description.includes("Transferência enviada pelo Pix")) {
    transferType = "PIX";
  } else if (description.includes("Transferência Recebida") || 
             description.includes("Transferência recebida pelo Pix")) {
    transferType = "PIX";
  } else if (description.includes("Compra no débito")) {
    transferType = "Débito";
  } else if (description.includes("Pagamento Recebido")) {
    transferType = "Recebimento";
  }

  // Extrair nome e documento
  if (description.includes("Transferência enviada pelo Pix") || 
      description.includes("Transferência Recebida") ||
      description.includes("Pagamento Recebido") ||
      description.includes("Reembolso recebido pelo Pix") ||
      description.includes("Transferência recebida pelo Pix")) {
    
    if (parts.length >= 3) {
      name = parts[1];
      document = parts[2];
    } else if (parts.length >= 2) {
      name = parts[1];
    }
    
  } else if (description.includes("Compra no débito") || 
             description.includes("Compra de FII") ||
             description.includes("Pagamento de boleto") ||
             description.includes("Pagamento de fatura") ||
             description.includes("Tarifa")) {
    
    if (parts.length >= 2) {
      name = parts[1];
    } else {
      name = parts[0];
    }
  }

  // Limpeza do nome
  name = name.replace(/•{3}\.\d{3}\.\d{3}-•{2}/g, "")
             .replace(/•{2}\.\d{3}\.\d{3}\/\d{4}-•{2}/g, "")
             .replace(/\s+/g, " ")
             .trim();

  // Limpeza do documento
  if (document) {
    document = document.replace(/[^\d.-]/g, "").trim();
    if (document === "" || document === "0000000000000" || document === "00000000000") {
      document = undefined;
    }
  }

  // Categorizar por tipo de negócio
  category = categorizeByBusiness(name, description);

  return { 
    name: name || "Desconhecido", 
    document,
    category,
    transferType
  };
}

export function generateClients(transactions: Transaction[]): Client[] {
  const clientsMap = new Map<string, Client>();

  transactions.forEach((t) => {
    const { name, document, category, transferType } = extractCounterpart(t.description);

    const key = document && document.length >= 11 ? 
      document : 
      `${name.toLowerCase().replace(/\s+/g, "_")}_${category}`;

    const delta = t.amount;

    if (clientsMap.has(key)) {
      const existing = clientsMap.get(key)!;
      existing.transactions += 1;
      existing.balance += delta;
      if (new Date(t.date) > existing.date) {
        existing.date = new Date(t.date);
      }
    } else {
      clientsMap.set(key, {
        id: clientsMap.size + 1,
        name,
        document: document || undefined,
        date: new Date(t.date),
        transactions: 1,
        balance: delta,
        category,
        transferType: transferType || undefined
      });
    }
  });

  return Array.from(clientsMap.values())
    .sort((a, b) => b.transactions - a.transactions || Math.abs(b.balance) - Math.abs(a.balance));
}