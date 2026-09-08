JavaScript
// Preços por cm para cada material
const PRECO_MATERIAL_CM = {
  "Alumínio": 0.50,
  "Aço Carbono": 0.80,
  "Aço Inox": 1.30,
  "Latão/Bronze": 1.00
};

// Custo fixo de ussinagem por peça (R$)
const CUSTO_FIXO_POR_PECA = 4.00;

// Tabela de descontos por volume
const DESCONTOS_VOLUME = [
  { min: 1, max: 50, desconto: 0 },
  { min: 51, max: 100, desconto: 0.05 },
  { min: 101, max: Infinity, desconto: 0.10 }
];

// Função para buscar desconto conforme quantidade
function buscarDesconto(quantidade) {
  for (let i = 0; i < DESCONTOS_VOLUME.length; i++) {
    const r = DESCONTOS_VOLUME[i];
    if (quantidade >= r.min && quantidade <= r.max) {
      return r.desconto;
    }
  }
  return 0;
}

// Formata número para Real brasileiro
function formatarBRL(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

// Função principal para calcular orçamento
function calcularOrcamento(material, tamanho, quantidade) {
  if (!PRECO_MATERIAL_CM.hasOwnProperty(material)) {
    throw new Error("Material inválido.");
  }
  if (tamanho < 1) tamanho = 1;
  if (quantidade < 1) quantidade = 1;

  const precoMaterial = PRECO_MATERIAL_CM[material];
  const precoUnitario = (tamanho * precoMaterial) + CUSTO_FIXO_POR_PECA;
  const subtotal = precoUnitario * quantidade;
  const desconto = buscarDesconto(quantidade);
  const valorComDesconto = subtotal * (1 - desconto);

  return {
    precoUnitario: precoUnitario,
    subtotal: subtotal,
    descontoPercentual: desconto,
    total: valorComDesconto,
    precoUnitarioBRL: formatarBRL(precoUnitario),
    subtotalBRL: formatarBRL(subtotal),
    totalBRL: formatarBRL(valorComDesconto)
  };
}