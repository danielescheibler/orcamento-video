export function showValidationMessage(message) {
  let container = document.getElementById('form-validation-message-container');
  if (container) {
    container.innerHTML = `<div class="form-validation-message">${message}</div>`;
  }
}

export function clearValidationMessage() {
  let container = document.getElementById('form-validation-message-container');
  if (container) container.innerHTML = '';
}

export function validarStep(currentStep, state) {
  if (currentStep === 0 && !state.tipoServico) return 'Selecione o tipo de serviço para continuar.';
  if (currentStep === 1 && (!state.nome || !state.email)) return 'Preencha nome e e-mail.';
  if (currentStep === 2 && !state.mensagemPublico) return 'Descreva seu objetivo/público.';
  if (currentStep === 3) {
    if (state.tipoServico === "video") {
      const duracaoBruto = Number(state.duracaoBruto);
      const duracaoFinal = Number(state.duracaoFinal);
      if (
        !state.duracaoBruto || !state.duracaoFinal ||
        isNaN(duracaoBruto) || isNaN(duracaoFinal)
      ) {
        return "Preencha os campos de duração apenas com números.";
      }
    } else {
      const tempoFinal = Number(state.tempoFinal);
      if (!state.tempoFinal || isNaN(tempoFinal)) {
        return "Preencha o tempo final apenas com números.";
      }
    }
  }
  if (currentStep === 4 && (!state.ref1 || !state.ref2)) return 'Informe os dois links de referência.';
  if (currentStep === 5) {
    if (state.tipoServico === "video") {
      if (!state.efeitosAnimacoes || !state.legenda) return 'Selecione efeitos/legenda.';
    } else {
      if (!state.descricao) return 'Descreva sua ideia/roteiro.';
    }
  }
  if (currentStep === 6) {
    if (state.tipoServico === "video") {
      if (!state.identidadeVisual) return 'Selecione sobre identidade visual.';
      if (state.identidadeVisual === 'sim' && !state.descIdentidade) return 'Descreva a identidade visual.';
    } else {
      if (!state.identidadeVisualMotion) return 'Selecione sobre identidade visual.';
      if (state.identidadeVisualMotion === 'sim' && !state.descIdentidadeMotion) return 'Descreva a identidade visual.';
    }
  }
  return null;
}