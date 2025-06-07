import { renderProgressBar } from './progress.js';
import { showValidationMessage, clearValidationMessage, validarStep } from './validation.js';
import { enviarOrcamento } from './api.js';
import { steps } from './steps.js';

let currentStep = 0;
let state = { tipoServico: null };
const totalSteps = steps.length;

function renderStep() {
  renderProgressBar(currentStep, totalSteps);

  const wizard = document.getElementById('wizard');
  if (!wizard) return;

  wizard.innerHTML = steps[currentStep](state);

  // Listeners (igual ao exemplo anterior)
  if (currentStep === 0) {
    document.getElementById('tipoServico').onchange = e => { 
      state.tipoServico = e.target.value; 
    };
  }
  if (currentStep === 1) {
    document.getElementById('nome').oninput = e => { state.nome = e.target.value; };
    document.getElementById('email').oninput = e => { state.email = e.target.value; };
  }
  if (currentStep === 2) {
    document.getElementById('mensagemPublico').oninput = e => { state.mensagemPublico = e.target.value; };
  }
  if (currentStep === 3) {
    if (state.tipoServico === 'video') {
      document.getElementById('duracaoBruto').oninput = e => { state.duracaoBruto = e.target.value; };
      document.getElementById('duracaoFinal').oninput = e => { state.duracaoFinal = e.target.value; };
    } else {
      document.getElementById('tempoFinal').oninput = e => { state.tempoFinal = e.target.value; };
    }
  }
  if (currentStep === 4) {
    document.getElementById('ref1').oninput = e => { state.ref1 = e.target.value; };
    document.getElementById('ref2').oninput = e => { state.ref2 = e.target.value; };
  }
  if (currentStep === 5) {
    if (state.tipoServico === 'video') {
      document.getElementById('efeitosAnimacoes').onchange = e => { state.efeitosAnimacoes = e.target.value; };
      document.getElementById('legenda').onchange = e => { state.legenda = e.target.value; };
    } else {
      document.getElementById('descricao').oninput = e => { state.descricao = e.target.value; };
    }
  }
  if (currentStep === 6) {
    if (state.tipoServico === 'video') {
      document.getElementById('identidadeVisual').onchange = e => { 
        state.identidadeVisual = e.target.value; 
        renderStep(); 
      };
      if (state.identidadeVisual === 'sim') {
        document.getElementById('descIdentidade').oninput = e => { state.descIdentidade = e.target.value; };
      }
    } else {
      document.getElementById('identidadeVisualMotion').onchange = e => { 
        state.identidadeVisualMotion = e.target.value; 
        renderStep(); 
      };
      if (state.identidadeVisualMotion === 'sim') {
        document.getElementById('descIdentidadeMotion').oninput = e => { state.descIdentidadeMotion = e.target.value; };
      }
    }
  }
  if (currentStep === 7) {
    document.getElementById('enviar-btn').onclick = async () => {
      const ok = await enviarOrcamento(state);
      if (ok) {
        document.getElementById('wizard').innerHTML = `
          <div class="step active" style="text-align:center;">
            <div style="color:#40849e;font-size:1.18em;font-weight:600;padding:32px 0 24px 0;">
              Orçamento enviado por e-mail.<br>Obrigada pelo interesse! 
            </div>
          </div>
        `;
        document.getElementById('progress-bar').innerHTML = '';
      }
    };
    document.getElementById('voltar-btn').onclick = () => {
      currentStep -= 1;
      renderStep();
    };
    return;
  }

  // Botões para as etapas anteriores (exceto na última)
  if (currentStep < steps.length - 1) {
    let formButtons = document.createElement('div');
    formButtons.className = "form-buttons";
    if (currentStep > 0) {
      let btnBack = document.createElement('button');
      btnBack.className = "back";
      btnBack.type = "button";
      btnBack.textContent = "Voltar";
      btnBack.onclick = () => {
        clearValidationMessage();
        currentStep -= 1;
        renderStep();
      };
      formButtons.appendChild(btnBack);
    }
    let btnNext = document.createElement('button');
    btnNext.className = "next";
    btnNext.type = "button";
    btnNext.textContent = "Próximo";
    btnNext.onclick = () => {
      clearValidationMessage();
      const validation = validarStep(currentStep, state);
      if (validation) {
        showValidationMessage(validation);
        return;
      }
      currentStep += 1;
      renderStep();
    };
    formButtons.appendChild(btnNext);
    wizard.appendChild(formButtons);

    let valMsgDiv = document.createElement('div');
    valMsgDiv.id = "form-validation-message-container";
    formButtons.parentNode.insertBefore(valMsgDiv, formButtons.nextSibling);
  }
}

window.onload = () => {
  currentStep = 0;
  state = { tipoServico: null };
  renderStep();
};