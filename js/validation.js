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
  if (currentStep === 0 && !state.tipoServico) return 'Que tal escolher o tipo de serviço pra gente começar? 😊';
  if (currentStep === 1 && (!state.nome || !state.email)) return 'Opa! Precisa preencher todos os campos hein 👀';
  if (currentStep === 2 && !state.mensagemPublico) return 'Me conta um pouquinho sobre seu objetivo ou público? Isso vai ajudar bastante!';
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
        return "Coloca o tempo final usando só números, por gentileza!";
      }
    }
  }
  if (currentStep === 4 && (!state.ref1 || !state.ref2)) return 'Pode me enviar dois links de referência? Isso vai ajudar a entender melhor o que você quer ✨';
  if (currentStep === 5) {
    if (state.tipoServico === "video") {
      if (!state.efeitosAnimacoes || !state.legenda) return 'Opa, tem campo em branco! Bora preencher?';
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