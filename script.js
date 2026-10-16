// ==============================
// VARIÁVEIS DE FÁCIL EDIÇÃO
// ==============================

// Preços por cm para cada material (R$)
const PRECO_MATERIAL_CM = {
  "Alumínio": 0.50,
  "Aço Carbono": 0.80,
  "Aço Inox": 1.30,
  "Latão/Bronze": 1.00
};

// Custo fixo de usinagem por peça (R$)
const CUSTO_FIXO_POR_PECA = 4.00;

// Tabela de descontos por volume
const DESCONTOS_VOLUME = [
  { min: 1, max: 50, desconto: 0 },           // 0% até 50 peças
  { min: 51, max: 100, desconto: 0.05 },      // 5% de 51 a 100
  { min: 101, max: Infinity, desconto: 0.10 } // 10% acima de 100
];

// Número de WhatsApp que recebe os pedidos (fictício: projeto acadêmico)
const NUMERO_WHATSAPP = "5511999999999";

// ==============================
// CÁLCULO
// ==============================

// Busca o desconto conforme a quantidade
function buscarDesconto(quantidade) {
  for (const faixa of DESCONTOS_VOLUME) {
    if (quantidade >= faixa.min && quantidade <= faixa.max) {
      return faixa.desconto;
    }
  }
  return 0;
}

// Formata número para Real brasileiro
function formatarBRL(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

// Calcula o orçamento a partir do material, do tamanho (cm) e da quantidade
function calcularOrcamento(material, tamanho, quantidade) {
  if (!Object.prototype.hasOwnProperty.call(PRECO_MATERIAL_CM, material)) {
    throw new Error("Material inválido.");
  }
  if (isNaN(tamanho) || tamanho < 1) tamanho = 1;
  if (isNaN(quantidade) || quantidade < 1) quantidade = 1;

  const precoUnitario = (tamanho * PRECO_MATERIAL_CM[material]) + CUSTO_FIXO_POR_PECA;
  const subtotal = precoUnitario * quantidade;
  const desconto = buscarDesconto(quantidade);
  const total = subtotal * (1 - desconto);

  return { precoUnitario, subtotal, desconto, total };
}

// ==============================
// INTERFACE
// ==============================

const materialEl = document.getElementById("material");
const tamanhoEl = document.getElementById("tamanho");
const quantidadeEl = document.getElementById("quantidade");
const precoUnitarioEl = document.querySelector("#resultado .preco-unitario b");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const descontoInfoEl = document.getElementById("desconto-info");
const btnWhatsApp = document.getElementById("whatsapp-btn");

// Atualiza o orçamento em tempo real
function atualizarOrcamento() {
  const orcamento = calcularOrcamento(
    materialEl.value,
    Number(tamanhoEl.value),
    Number(quantidadeEl.value)
  );

  precoUnitarioEl.textContent = formatarBRL(orcamento.precoUnitario);
  subtotalEl.textContent = formatarBRL(orcamento.subtotal);
  totalEl.textContent = formatarBRL(orcamento.total);

  descontoInfoEl.innerHTML = orcamento.desconto > 0
    ? `Desconto por volume: <b>-${(orcamento.desconto * 100).toFixed(0)}%</b><br>`
    : "";

  btnWhatsApp.style.display = "block";
}

// Monta a mensagem enviada pelo WhatsApp
function montarMensagemWhatsApp() {
  return [
    "Olá, gostaria de solicitar orçamento oficial para usinagem CNC:",
    `- Material: ${materialEl.value}`,
    `- Tamanho: ${tamanhoEl.value} cm`,
    `- Quantidade: ${quantidadeEl.value}`,
    `- Valor estimado: ${totalEl.textContent}`,
    "",
    "(Aguardando confirmação final pela equipe FastPeças Diadema)"
  ].join("\n");
}

btnWhatsApp.addEventListener("click", function () {
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(montarMensagemWhatsApp())}`;
  window.open(url, "_blank", "noopener");
});

[materialEl, tamanhoEl, quantidadeEl].forEach(function (el) {
  el.addEventListener("input", atualizarOrcamento);
});

// Inicializa com os valores padrão
atualizarOrcamento();
