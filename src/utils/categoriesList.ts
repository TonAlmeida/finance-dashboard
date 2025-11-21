export const expensesCategories: Record<string, string[]> = {
  // 🛒 Alimentação e Básicos
  "Mercado / Supermercado": [
    "mercado", "supermercado", "carrefour", "atacadão", "pão de açúcar", "hiper", "extra",
    "mercantil", "minimercado", "conveniência", "compras", "feira", "hortifruti", "sacolão",
    "atacado", "assai", "sam's club", "big", "super", "hipermercado", "varejo", "varejão",
    "quitanda", "mercearia", "armazém", "loja de conveniência", "dia", "condor", "angeloni"
  ],
  
  "Alimentação / Restaurante": [
    "restaurante", "lanchonete", "hamburguer", "pizzaria", "bk", "mcdonald", "ifood",
    "delivery", "sanduíche", "almoço", "jantar", "lanche", "comida", "fast food",
    "burguer king", "habibs", "bob's", "subway", "giraffas", "mcdonalds", "outback",
    "applebees", "china in box", "spoleto", "sushi", "japa", "churrascaria", "rodízio",
    "food truck", "cafeteria", "padaria", "confeitaria", "sorveteria", "café", "starbucks",
    "burger king", "a la carte", "buffet", "self service", "taco bell", "kfc", "pizza hut"
  ],

  "Bebidas / Tabacaria": [
    "tabacaria", "vape", "narguile", "fumo", "cigarro", "bebida", "bar", "cerveja", "vinho",
    "vodka", "whisky", "destilado", "drink", "balada", "noite", "boteco", "cachimbo",
    "liquor", "distribuidora de bebidas", "adega", "empório", "drinks", "coquetel",
    "chop", "cervejaria", "whiskey", "ron", "gin", "tequila", "absinto", "conhaque",
    "pinga", "cachaça", "smirnoff", "jack daniels", "johnnie walker", "heineken", "skol",
    "brahma", "antartica", "stella artois", "budweiser"
  ],

  // 🏠 Moradia e Serviços
  "Serviços Domésticos": [
    "água", "energia", "luz", "conta de água", "conta de luz", "sabesp", "copasa",
    "enel", "neoenergia", "coelba", "limpeza", "faxina", "condomínio", "gás", "conta de gás",
    "comgás", "luz e energia", "eletricidade", "hidrelétrica", "concessionária",
    "empregada doméstica", "diarista", "zelador", "portaria", "limpeza doméstica",
    "produtos de limpeza", "detergente", "sabão", "amaciante", "desinfetante"
  ],

  "Telecomunicações": [
    "telefone", "internet", "claro", "vivo", "tim", "oi", "tv", "net", "sky", "streaming",
    "plano", "wi-fi", "celular", "recarga", "assinatura", "fibra óptica", "banda larga",
    "operadora", "telefonia", "chip", "pré-pago", "pós-pago", "nextel", "algar",
    "sercomtel", "copel", "embratel", "multilaser", "intelig", "controle", "claro tv",
    "vivo tv", "oi tv", "net tv", "sky tv", "directv", "paramount", "hbo max", "disney+",
    "amazon prime", "apple tv", "youtube premium", "spotify", "deezer", "apple music"
  ],

  "Aluguel / Moradia": [
    "aluguel", "locação", "apartamento", "casa", "condomínio", "imobiliária", "airbnb",
    "hospedagem", "pousada", "resort", "hotel", "hospedagem temporária", "quitinete",
    "kitnet", "flat", "studio", "sobrado", "bangalô", "chalé", "vila", "pensão",
    "hostel", "motel", "pouso", "pernoite", "diária hotel", "reserva hotel"
  ],

  "Manutenção / Reforma": [
    "construção", "reforma", "tinta", "cimento", "ferramenta", "obra", "encanador",
    "eletricista", "material de construção", "móveis", "decoração", "lar", "pedreiro",
    "pintor", "gesso", "cerâmica", "porcelanato", "piso", "revestimento", "telha",
    "tijolo", "areia", "brita", "ferro", "madeira", "serralheria", "marcenaria",
    "vidraçaria", "impermeabilização", "hidráulica", "elétrica", "gás encanado",
    "paisagismo", "jardinagem", "grama", "vaso", "terra", "adubo", "inseticida"
  ],

  // 🚗 Transporte e Veículo
  "Transporte / Mobilidade": [
    "uber", "99", "cabify", "ônibus", "metrô", "trem", "taxi", "rodoviária", "bilhete único",
    "transporte", "carona", "passagem", "transporte público", "van", "lotação",
    "aplicativo de transporte", "uber eats", "rappi", "ifood delivery", "motoboy",
    "entregador", "frete", "sedex", "correios", "jazzy", "lime", "bird", "patinete",
    "bicicleta", "aluguel de bike", "estacionamento", "garagem", "parquímetro",
    "zona azul", "sem parar", "veloe", "tag", "conectcar"
  ],

  "Combustível / Posto": [
    "posto", "gasolina", "etanol", "diesel", "abastecimento", "combustível", "fuel",
    "lubrificante", "óleo", "shell", "ipiranga", "br", "petrobras", "petrobrás",
    "texaco", "ale", "atalaia", "vibra", "raizen", "dislub", "lubrax", "aditivada",
    "gasolina aditivada", "etanol aditivado", "gnv", "gás natural", "gás veicular",
    "botijão", "gás de cozinha", "glp", "gnv", "instalação gnv"
  ],

  "Veículo / Manutenção": [
    "carro", "moto", "oficina", "autopeças", "lavagem", "seguro veicular", "licenciamento",
    "ipva", "rodízio", "manutenção automotiva", "reparo", "mecânico", "funilaria",
    "martelinho de ouro", "polimento", "cristalização", "vitrificação", "pneu",
    "calibragem", "alinhamento", "balanceamento", "cambio", "embreagem", "freio",
    "suspensão", "bateria", "alternador", "radiador", "ar condicionado", "troca de óleo",
    "filtro", "vela", "correia", "pastilha de freio", "disco de freio", "amortecedor",
    "cambio automático", "lavagem automotiva", "higienização", "blindagem", "r astec"
  ],

  // 👨‍👩‍👧‍👦 Pessoais e Família
  "Vestuário / Moda": [
    "roupa", "sapato", "renner", "riachuelo", "cea", "marisa", "blusa", "camisa",
    "calça", "vestido", "tênis", "bolsa", "acessório", "moda", "chuteira", "óculos",
    "loja de roupas", "brechó", "outlet", "shopping", "centro comercial", "mall",
    "lojas americanas", "magazine luiza", "casas bahia", "centauro", "nike", "adidas",
    "puma", "oakley", "rayban", "luxottica", "sunglass", "relógio", "joia", "bijuteria",
    "semijoia", "alfaiataria", "costureira", "conserto roupa", "lavanderia", "tingimento"
  ],

  "Beleza / Estética": [
    "salão", "barbearia", "cabelo", "manicure", "pedicure", "maquiagem", "perfume",
    "cosmético", "skincare", "tratamento", "spa", "massagem", "corte", "escova",
    "progressiva", "luzes", "mechas", "coloração", "alisamento", "hidratação",
    "botox", "preenchimento", "limpeza de pele", "depilação", "sobrancelha",
    "designer de sobrancelhas", "extensão de cílios", "unha", "esmalteria",
    "podologia", "esteticista", "dermato", "dermatologista", "clínica estética",
    "academia", "personal", "instrutor", "avon", "natura", "boticario", "o boticário"
  ],

  "Saúde / Farmácia": [
    "farmácia", "remédio", "droga", "raia", "pacheco", "exame", "consulta", "hospital",
    "dentista", "clínica", "laboratório", "nutricionista", "psicólogo", "saúde",
    "medicamento", "farmacia", "drogasil", "drogaraia", "drogaria", "panvel",
    "pague menos", "são joão", "santa casa", "sus", "particular", "plano de saúde",
    "unimed", "amil", "bradesco saúde", "sulamerica", "hapvida", "notredame",
    "psiquiatra", "cardiologista", "clinico geral", "pediatra", "ginecologista",
    "obstetra", "ortopedista", "fisioterapia", "fonoaudiologia", "terapia",
    "raio x", "ultrassom", "tomografia", "ressonância", "sangue", "coleta",
    "vacina", "imunização", "pronto socorro", "emergência", "uti", "enfermaria"
  ],

  "Educação / Cursos": [
    "curso", "faculdade", "escola", "universidade", "ensino", "professor", "ead",
    "treinamento", "formação", "certificação", "apostila", "curso online", "graduação",
    "pós-graduação", "mba", "mestrado", "doutorado", "escolar", "material escolar",
    "livro didático", "uniforme", "mensalidade escolar", "creche", "berçário",
    "educação infantil", "fundamental", "médio", "superior", "senac", "senai",
    "sebrae", "cursos livres", "idiomas", "inglês", "espanhol", "francês",
    "wizard", "cna", "yazigi", "ccaa", "fisk", "cultura inglesa", "alura", "udemy",
    "coursera", "edx", "khan academy", "escola técnica", "etec"
  ],

  "Academia / Esportes": [
    "academia", "treino", "crossfit", "musculação", "pilates", "dança", "aula de luta",
    "jiu-jitsu", "karatê", "futebol", "basquete", "esporte", "corrida", "ginástica",
    "yoga", "meditação", "artes marciais", "muay thai", "boxe", "judô", "taekwondo",
    "capoeira", "natação", "hidroginástica", "personal trainer", "avaliação física",
    "suplemento", "whey protein", "creatina", "pré-treino", "bcaa", "glutamina",
    "vitamina", "smart fit", "bluefit", "bio ritmo", "fitness", "gympass", "classpass"
  ],

  // 💼 Trabalho e Negócios
  "Serviços / Freelance": [
    "serviço", "freela", "freelancer", "autônomo", "prestação de serviço", "contrato",
    "consultoria", "design", "programação", "projeto", "trabalho autônomo",
    "profissional liberal", "arquiteto", "engenheiro", "advogado", "contador",
    "designer", "programador", "desenvolvedor", "redator", "tradutor", "revisor",
    "fotógrafo", "videomaker", "editor", "social media", "marketing digital",
    "gestor de tráfego", "web designer", "ui/ux", "product manager", "scrum master"
  ],

  "Empreendimento / Negócios": [
    "empresa", "negócio", "empreendimento", "venda", "compra", "fornecedor", "cliente",
    "parceiro", "revenda", "lojista", "estoque", "mercadoria", "produto", "insumo",
    "matéria-prima", "equipamento", "maquinário", "ferramenta profissional",
    "nota fiscal", "imposto empresarial", "simples nacional", "mei", "me",
    "empresário", "sócio", "sociedade", "franquia", "licença", "alvará", "certidão",
    "registro", "patente", "marca", "cnpj", "jurídico empresarial", "contabilidade"
  ],

  // 💰 Financeiros
  "Serviços Financeiros": [
    "banco", "cartão", "empréstimo", "financiamento", "juros", "parcelamento", "taxa",
    "tarifa", "conta", "pix", "transferência", "boleto", "pagamento", "itau", "nubank",
    "bradesco", "santander", "bb", "caixa", "inter", "c6", "neon", "banco do brasil",
    "caixa econômica", "sicoob", "sicredi", "banrisul", "safra", "pan", "original",
    "next", "picpay", "mercado pago", "pagseguro", "paypal", "wirecard", "stone",
    "pagbank", "anuidade", "manutenção de conta", "saque", "extrato", "aplicação",
    "resgate", "ted", "doc", "cheque", "cofrinho", "porquinho", "investimento"
  ],

  "Seguros": [
    "seguro", "vida", "automóvel", "residencial", "patrimonial", "plano de saúde",
    "proteção", "assistência", "corretora", "bradesco seguros", "porto seguro",
    "sulamerica seguros", "allianz", "tokio marine", "mapfre", "sompo", "hdi",
    "liberty", "azul seguros", "previdência", "privada", "fundo de pensão",
    "capitalização", "titulo de capitalização", "bilhete", "apólice", "sinistro",
    "indemnização", "cobertura", "franquia", "prêmio", "corretor de seguros"
  ],

  "Impostos / Taxas": [
    "imposto", "iptu", "ipva", "tarifa", "taxa", "multa", "contribuição", "inss",
    "darf", "irpf", "licença", "ir", "imposto de renda", "cpmf", "csll", "pis",
    "cofins", "icms", "iss", "ipi", "iof", "itcmd", "itbi", "taxa de incêndio",
    "taxa de lixo", "taxa de esgoto", "taxa de coleta", "alvará", "certidão negativa",
    "certidão positiva", "guia de recolhimento", "gare", "grf", "grpu", "fgts",
    "pis/pasep", "contribuição sindical", "taxa condominial", "taxa administrativa"
  ],

  // 🎭 Lazer e Entretenimento
  "Entretenimento / Assinaturas": [
    "cinema", "show", "ingresso", "evento", "teatro", "netflix", "spotify", "youtube premium",
    "disney+", "hbo", "prime video", "jogo", "game", "playstation", "xbox", "assinatura",
    "streaming", "globoplay", "canal", "tv a cabo", "parque", "diversão", "brinquedos",
    "videogame", "nintendo", "steam", "epic games", "origin", "battle.net", "twitch",
    "tiktok", "instagram", "facebook", "redes sociais", "aplicativo pago", "app store",
    "google play", "onlyfans", "patreon", "clubhouse", "discord nitro", "zoom pro"
  ],

  "Viagem / Lazer": [
    "viagem", "turismo", "passagem aérea", "hotel", "pousada", "resort", "excursão",
    "airbnb", "trip", "hospedagem", "passeio", "tour", "lazer", "ferias", "férias",
    "turismo", "agencia de viagens", "cvc", "decolar", "submarino viagens", "123 milhas",
    "maxmilhas", "latam", "gol", "azul", "avianca", "tam", "voegol", "alitalia",
    "air france", "british airways", "lufthansa", "emirates", "qatar", "etihad",
    "cruzeiro", "navio", "transatlântico", "road trip", "mochilão", "backpacker",
    "hostelling", "albergue", "couchsurfing", "turismo aventura", "ecoturismo"
  ],

  "Presentes / Doações": [
    "presente", "aniversário", "doação", "caridade", "ajuda", "oferta", "brinde", "lembrança",
    "natal", "pascoa", "dia das mães", "dia dos pais", "casamento", "formatura",
    "batizado", "confeitaria", "floricultura", "flor", "buquê", "arranjo", "cesta",
    "café", "vinho", "chocolate", "bombom", "cartão", "embalagem", "papel de presente",
    "unicef", "cruz vermelha", "médicos sem fronteiras", "ação da cidadania",
    "campanha do agasalho", "alimento", "cesta básica", "ongs", "filantropia"
  ],

  // 💻 Tecnologia
  "Tecnologia / Eletrônicos": [
    "eletrônico", "apple", "google", "amazon", "notebook", "computador", "smartphone",
    "tablet", "hardware", "software", "impressora", "celular", "periférico", "tecnologia",
    "smartwatch", "fone de ouvido", "gadget", "iphone", "ipad", "macbook", "imac",
    "samsung", "motorola", "xiaomi", "lg", "sony", "asus", "acer", "dell", "hp",
    "lenovo", "msi", "razer", "logitech", "intel", "amd", "nvidia", "geforce",
    "playstation", "xbox", "nintendo switch", "oculus", "vr", "realidade virtual",
    "drone", "gopro", "câmera", "fotografia", "filmagem", "webcam", "microfone",
    "teclado", "mouse", "monitor", "ssd", "hd", "memória ram", "placa de vídeo",
    "processador", "placa mãe", "fonte", "gabinete", "cooler", "water cooler"
  ],

  "Eletrodomésticos / Casa": [
    "geladeira", "fogão", "microondas", "máquina de lavar", "ventilador", "televisão",
    "tv", "cafeteira", "liquidificador", "aspirador", "doméstico", "eletrodoméstico",
    "refrigerador", "freezer", "lavadora", "secadora", "tanquinho", "lava-louças",
    "forno", "cooktop", "ar condicionado", "aquecedor", "umidificador", "purificador",
    "ferro de passar", "máquina de costura", "batedeira", "processador", "mixer",
    "grill", "sanduicheira", "waffleira", "panela elétrica", "airfryer", "fritadeira",
    "panela de pressão", "termômetro", "balança", "cortador", "ralador", "espremedor",
    "torradeira", "máquina de pão", "yogurteira", "sobremesa", "sorveteira"
  ],

  // 🐾 Animais e Família
  "Animais / Pets": [
    "pet", "cachorro", "gato", "ração", "veterinário", "petshop", "banho e tosa", "acessórios pet",
    "animal", "petisco", "brinquedo pet", "gaiola", "aquário", "terrário", "coleira",
    "guia", "cama pet", "casinha", "tapete higiênico", "areia sanitária", "shampoo",
    "antipulgas", "carrapaticida", "vermífugo", "vacina animal", "castração",
    "consultório veterinário", "clínica veterinária", "hospital veterinário",
    "emergência veterinária", "pet love", "cobasi", "petz", "animal world",
    "petcenter", "zoo", "aves", "pássaros", "peixes", "répteis", "roedores"
  ],

  "Filhos / Família": [
    "criança", "filho", "escola infantil", "brinquedo", "berçário", "creche", "maternal",
    "roupas infantis", "pais", "família", "babá", "berço", "carrinho", "babá eletrônica",
    "mamadeira", "chupeta", "fralda", "pomada", "leite", "papinha", "alimentação infantil",
    "pediatra", "obstetra", "parto", "enxoval", "gestante", "grávida", "pré-natal",
    "ultrassom", "teste de gravidez", "maternidade", "aleitamento", "bombinha de tirar leite",
    "cadeirinha", "bebê conforto", "andador", "pula-pula", "parquinho", "playground",
    "aniversário infantil", "festinha", "decoração", "lembrancinha", "papai noel",
    "coelhinho da páscoa", "dia das crianças", "natal em família"
  ],

  "Outros": [
    "outros", "diversos", "desconhecido", "sem categoria", "gasto não identificado",
    "misc", "variedades", "geral", "avulso", "ocasional", "eventual", "imprevisto",
    "emergência", "urgência", "crise", "problema", "solução", "conserto", "reparo",
    "manutenção corretiva", "falha", "defeito", "avaria", "quebra", "acidente",
    "sinistro", "perda", "extraviado", "roubo", "furto", "assalto", "indenização"
  ]
};

export const incomeCategories: Record<string, string[]> = {
  "Salário / Trabalho": [
    "salário", "pagamento", "holerite", "contracheque", "renda fixa",
    "trabalho", "serviço", "emprego", "provento", "mensal", "sal",
    "diária", "extra", "adicional", "hora extra", "comissão", "bônus",
    "gratificação", "adicional noturno", "feriado", "periculosidade",
    "insalubridade", "13º", "decimo terceiro", "férias", "rescisão",
    "verbas rescisórias", "aviso prévio", "multa 477", "fgts", "piso",
    "cargo", "função", "empregador", "contratante", "recibo de pagamento",
    "pro labore", "distribuição de lucros", "participação nos lucros",
    "plr", "premiação", "metas", "resultados", "performance"
  ],

  "Freelance / Autônomo": [
    "freela", "freelancer", "autônomo", "bico", "projeto", "contrato",
    "consultoria", "pagamento avulso", "prestação de serviço",
    "serviço avulso", "trampo", "job", "trabalho temporário",
    "serviço técnico", "assessoria", "mentoria", "coaching",
    "aula particular", "explicações", "reforço escolar", "tradução",
    "revisão", "digitação", "formatação", "design gráfico",
    "desenvolvimento web", "programação", "site", "aplicativo",
    "manutenção", "reparo", "instalação", "montagem", "entrega",
    "motorista", "entregador", "motoboy", "uber", "99", "cabify",
    "ifood", "rappi", "delivery", "entregas"
  ],

  "Empreendimento / Negócios": [
    "empresa", "negócio", "venda", "lucro", "receita", "pro labore",
    "dividendo", "retirada", "faturamento", "lojista", "cliente",
    "revenda", "mercado automático", "negócio online", "e-commerce",
    "loja virtual", "shopee", "mercado livre", "amazon", "magalu",
    "americanas", "submarino", "netshoes", "dafiti", "centauro",
    "olx", "enjoei", "estoquista", "varejo", "atacado", "distribuidor",
    "representante", "corretor", "agente", "franqueado", "licenciado",
    "parceiro", "affiliate", "marketing multinível", "network marketing"
  ],

  "Investimentos / Aplicações": [
    "investimento", "rendimento", "juros", "dividendos", "proventos",
    "ações", "tesouro", "cdb", "fii", "fundos", "cripto", "binance",
    "rendimentos financeiros", "rentabilidade", "lci", "lca", "lc",
    "debênture", "cri", "cra", "fidc", "bdr", "etf", "bolsa de valores",
    "b3", "bm&f", "day trade", "swing trade", "trade", "opções",
    "futuros", "mercado futuro", "renda variável", "renda fixa",
    "poupança", "cdi", "selic", "ipca", "igpm", "tr", "prefixado",
    "pós-fixado", "híbrido", "multimercado", "cambio", "dólar",
    "euro", "bitcoin", "ethereum", "cardano", "solana", "polkadot",
    "shiba", "dogecoin", "nft", "metaverso", "defi", "staking",
    "yield farming", "liquidity pool", "airdrop"
  ],

  "Pix / Transferências Recebidas": [
    "pix recebido", "transferência recebida", "depósito", "transferência",
    "recebimento", "recebi pix", "entrada via pix", "pagamento recebido",
    "pix", "chave pix", "qr code", "ted recebida", "doc recebido",
    "credito em conta", "valor creditado", "deposito identificado",
    "compensação", "estorno recebido", "devolução recebida",
    "reembolso recebido", "cashback creditado", "bonus",
    "indicação", "convidado", "amigo", "presente digital"
  ],

  "Venda de Produtos / Bens": [
    "venda", "vendido", "mercado livre", "olx", "produto vendido",
    "item vendido", "brechó", "roupa vendida", "equipamento vendido",
    "eletrônico vendido", "carro vendido", "moto vendida", "imóvel vendido",
    "terreno vendido", "apartamento vendido", "casa vendida",
    "móvel vendido", "eletrodoméstico vendido", "celular vendido",
    "notebook vendido", "tablet vendido", "game vendido", "console vendido",
    "joia vendida", "relógio vendido", "obra de arte vendida",
    "antiguidade vendida", "coleção vendida", "nft vendido",
    "criptomoeda vendida", "leilão", "lance", "arrematado"
  ],

  "Reembolsos / Estornos": [
    "reembolso", "estorno", "devolução", "cashback", "retorno",
    "correção", "desconto reverso", "chargeback", "contestação",
    "cancelamento", "reversão", "compensação", "indenização",
    "ressarcimento", "restituição", "devolução de imposto",
    "irpf restituição", "pis/pasep", "fgts", "seguro desemprego",
    "auxílio", "benefício", "programa social", "bolsa família",
    "auxílio brasil", "bpc", "loas"
  ],

  "Aluguel / Imóveis": [
    "aluguel recebido", "locação", "imóvel", "inquilino", "renda imobiliária",
    "arrendamento", "temporada", "airbnb renda", "booking", "vrbo",
    "tripadvisor", "homeaway", "aluguel de quarto", "república",
    "pensão", "hostel", "albergue", "estadia", "diária recebida",
    "reserva", "hospedagem", "cama", "quarto", "suite", "apartamento",
    "casa", "sobrado", "kitnet", "studio", "flat", "loft",
    "cobertura", "penthouse", "bangalô", "chalé", "sítio", "fazenda",
    "chácara", "rancho", "loteamento", "condomínio", "garagem",
    "vaga", "box", "depósito", "galpão", "armazém", "sala comercial"
  ],

  "Aposentadoria / Benefícios": [
    "aposentadoria", "inss", "benefício", "auxílio", "pensão",
    "bolsa família", "auxílio brasil", "auxílio emergencial", "bpc",
    "loas", "aposentadoria por invalidez", "aposentadoria por tempo",
    "aposentadoria por idade", "aposentadoria rural", "pensão alimentícia",
    "pensão por morte", "auxílio-doença", "auxílio-acidente",
    "salário-maternidade", "seguro-desemprego", "abono salarial",
    "piso", "quota", "cotista", "fundos", "previdência", "privada",
    "fapi", "vgbl", "plano", "complementar", "fundo de aposentadoria"
  ],

  "Prêmios / Sorteios": [
    "prêmio", "sorteio", "raspadinha", "mega sena", "loteria",
    "ganhei", "premiação", "concurso", "competição", "campeonato",
    "torneio", "olimpíada", "jogos", "gincana", "rifa", "leilão",
    "bingo", "caça-níquel", "cassino", "poker", "blackjack",
    "roleta", "aposta", "bet", "bet365", "sportingbet", "bets",
    "esportiva", "jogo do bicho", "loteca", "quina", "lotomania",
    "dupla sena", "timemania", "federal", "loteria federal",
    "bilhete premiado", "título capitalização", "capitalizacao",
    "teimosinha", "raspadinho", "cupom", "promoção", "concorrência"
  ],

  "Doações Recebidas": [
    "doação recebida", "ajuda", "presente em dinheiro",
    "transferência de familiar", "apoio", "contribuição",
    "oferta", "dízimo", "ofertório", "coleta", "campanha",
    "vaquinha", "financiamento coletivo", "crowdfunding",
    "kickstarter", "catarse", "apoia.se", "vakinha",
    "beneficente", "filantropia", "caridade", "solidariedade",
    "irmão", "irmã", "pai", "mãe", "filho", "filha", "avô",
    "avó", "tio", "tia", "primo", "prima", "sobrinho", "sobrinha",
    "neto", "neta", "parente", "família", "amigo", "amiga",
    "colega", "conhecido", "parceiro", "sócio", "investidor",
    "patrocinador", "mecenas", "benfeitor", "doador"
  ],

  "Outros": [
    "outros", "diversos", "não identificado", "renda desconhecida",
    "ganhos diversos", "entrada geral", "extra", "avulso",
    "eventual", "ocasional", "imprevisto", "inesperado",
    "surpresa", "fortuna", "sorte", "oportunidade", "achado",
    "encontrado", "herança", "testamento", "inventário",
    "partilha", "divisão", "cessão", "direitos", "royalties",
    "direito autoral", "propriedade intelectual", "patente",
    "marca", "franquia", "licenciamento", "franchising",
    "aluguel de equipamento", "locação de maquinário",
    "empréstimo recebido", "financiamento recebido",
    "adiantamento", "sinal", "entrada", "capitação",
    "recursos", "verba", "subvenção", "subsídio", "incentivo",
    "fomento", "bolsa", "estágio", "trainee", "jovem aprendiz",
    "menor aprendiz", "programa", "governo", "municipal",
    "estadual", "federal", "internacional", "exterior"
  ],
};