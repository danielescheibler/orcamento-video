// js/orcamentoRules.js

// Função de cálculo conforme tabela do print (junho/2025) e ajustes do chat
export function calcularValor(state) {
  // Parâmetros
  const prazoPadrao = 4; // dias úteis padrão
  const taxaUrgencia = 0.3; // 30% para urgência (1-2 dias)
  let urgente = false;
  let prazo = prazoPadrao;

  // Se o campo prazoEntrega existir no state e for <= 2, ativa urgência
  if (state.prazoEntrega) {
    prazo = Number(state.prazoEntrega);
    if (prazo <= 2) urgente = true;
  }

  let valor = 0;
  let aPartirDe = true; // Sempre mostrar: "a partir de"
  let legendaIncluida = state.legenda === "sim";

  // MOTION DESIGN
  if (state.tipoServico === 'motion') {
    if (Number(state.tempoFinal) && Number(state.tempoFinal) <= 5) valor = 300;
    else if (Number(state.tempoFinal) && Number(state.tempoFinal) <= 10) valor = 600;
    else valor = 600; // fallback para motion especial
    // Não soma legenda para motion
  }

  // EDIÇÃO DE VÍDEO
  if (state.tipoServico === 'video') {
    // Edição simples: agora inclui "nao" E "simples"
    if (state.efeitosAnimacoes === "simples" || state.efeitosAnimacoes === "nao") {
      if (
        Number(state.duracaoFinal) && Number(state.duracaoFinal) <= 1.5 &&
        Number(state.duracaoBruto) && Number(state.duracaoBruto) <= 3
      ) {
        // AJUSTE: 110 sem legenda, 150 com legenda
        valor = state.legenda === "sim" ? 150 : 110;
      }
      else if (
        Number(state.duracaoFinal) && Number(state.duracaoFinal) <= 5 &&
        Number(state.duracaoBruto) && Number(state.duracaoBruto) <= 10
      ) {
        valor = state.legenda === "sim" ? 240 : 200; // legenda soma +40
      }
      else if (
        Number(state.duracaoFinal) && Number(state.duracaoFinal) <= 15 &&
        Number(state.duracaoBruto) && Number(state.duracaoBruto) <= 25
      ) {
        valor = state.legenda === "sim" ? 440 : 400; // legenda soma +40
      }
    }
    // Edição complexa (efeitos complexos)
    if (state.efeitosAnimacoes === "complexos") {
      if (
        Number(state.duracaoFinal) && Number(state.duracaoFinal) <= 1.5 &&
        Number(state.duracaoBruto) && Number(state.duracaoBruto) <= 3
      ) valor = 600;
      else if (
        Number(state.duracaoFinal) && Number(state.duracaoFinal) <= 5 &&
        Number(state.duracaoBruto) && Number(state.duracaoBruto) <= 10
      ) valor = 900;
      else if (
        Number(state.duracaoFinal) && Number(state.duracaoFinal) <= 15 &&
        Number(state.duracaoBruto) && Number(state.duracaoBruto) <= 25
      ) valor = 1500;
    }
  }

  // Se for urgente, aplica taxa
  if (urgente) valor = Math.round(valor * (1 + taxaUrgencia));

  // Retorno completo
  return {
    valor,
    aPartirDe,
    urgente,
    prazo,
    revisoes: 1,
    legendaIncluiRevisao: legendaIncluida
  };
}