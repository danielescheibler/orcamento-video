import { renderProgressBar } from './progress.js';
import { showValidationMessage, clearValidationMessage, validarStep } from './validation.js';
import { enviarOrcamento } from './api.js';
import { steps } from './steps.js';

let currentStep = 0;
let state = { tipoServico: null };
const totalSteps = steps.length;

function renderStep() {
  renderProgressBar(currentStep, totalSteps);

  // --- Ajuste para progress bar descer na etapa 0 mobile ---
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    if (window.innerWidth <= 600 && currentStep === 0) {
      progressBar.classList.add('step0-mobile-bar');
    } else {
      progressBar.classList.remove('step0-mobile-bar');
    }
  }
  // ---------------------------------------------------------

  const wizard = document.getElementById('wizard');
  if (!wizard) return;

  wizard.innerHTML = steps[currentStep](state);

  // Adiciona/remover classe especial para a etapa 0 mobile
  const formContainer = wizard.parentElement;
  if (window.innerWidth <= 600) {
    if (currentStep === 0) {
      formContainer.classList.add('step0-mobile');
    } else {
      formContainer.classList.remove('step0-mobile');
    }
  } else {
    formContainer.classList.remove('step0-mobile');
  }

  // Esconde topo no mobile após escolha do tipo de serviço
  if (window.innerWidth <= 600) {
    if (currentStep > 0) {
      // Esconde o topo e expande o formulário
      const layoutLeft = document.querySelector('.layout-left');
      const layoutRight = document.querySelector('.layout-right');
      if (layoutLeft) layoutLeft.style.display = 'none';
      if (layoutRight) {
        layoutRight.style.width = '100vw';
        layoutRight.style.maxWidth = '100vw';
      }
    } else if (currentStep === 0) {
      // Mostra topo e reseta layout
      const layoutLeft = document.querySelector('.layout-left');
      const layoutRight = document.querySelector('.layout-right');
      if (layoutLeft) layoutLeft.style.display = '';
      if (layoutRight) {
        layoutRight.style.width = '';
        layoutRight.style.maxWidth = '';
      }
    }
  }

  // Etapa 0: listeners para select (desktop) e botões (mobile)
  if (currentStep === 0) {
    // DESKTOP: select
    const selectTipo = document.getElementById('tipoServico');
    if (selectTipo) {
      selectTipo.onchange = e => { 
        state.tipoServico = e.target.value; 
        // No desktop, não avança automaticamente
      };
    }

    // MOBILE: botões
    const optionBtns = document.querySelectorAll('.option-btn');
    if (optionBtns.length) {
      optionBtns.forEach(btn => {
        btn.onclick = () => {
          state.tipoServico = btn.getAttribute('data-value');
          // Esconde topo no mobile ao avançar
          if (window.innerWidth <= 600) {
            const layoutLeft = document.querySelector('.layout-left');
            const layoutRight = document.querySelector('.layout-right');
            if (layoutLeft) layoutLeft.style.display = 'none';
            if (layoutRight) {
              layoutRight.style.width = '100vw';
              layoutRight.style.maxWidth = '100vw';
            }
          }
          currentStep += 1;
          renderStep();
        };
      });
    }
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
      // Se voltar para etapa 0, reexibe topo (mobile)
      if (currentStep === 0 && window.innerWidth <= 600) {
        const layoutLeft = document.querySelector('.layout-left');
        const layoutRight = document.querySelector('.layout-right');
        if (layoutLeft) layoutLeft.style.display = '';
        if (layoutRight) {
          layoutRight.style.width = '';
          layoutRight.style.maxWidth = '';
        }
      }
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
        // Se voltar para etapa 0, reexibe topo (mobile)
        if (currentStep === 0 && window.innerWidth <= 600) {
          const layoutLeft = document.querySelector('.layout-left');
          const layoutRight = document.querySelector('.layout-right');
          if (layoutLeft) layoutLeft.style.display = '';
          if (layoutRight) {
            layoutRight.style.width = '';
            layoutRight.style.maxWidth = '';
          }
        }
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
      // Se avançar para etapa 1 no mobile, esconde topo
      if (currentStep > 0 && window.innerWidth <= 600) {
        const layoutLeft = document.querySelector('.layout-left');
        const layoutRight = document.querySelector('.layout-right');
        if (layoutLeft) layoutLeft.style.display = 'none';
        if (layoutRight) {
          layoutRight.style.width = '100vw';
          layoutRight.style.maxWidth = '100vw';
        }
      }
      renderStep();
    };
    formButtons.appendChild(btnNext);
    wizard.appendChild(formButtons);

 
      formButtons.insertAdjacentElement("afterend", socialBelow);
    }

    let valMsgDiv = document.createElement('div');
    valMsgDiv.id = "form-validation-message-container";
    formButtons.parentNode.insertBefore(valMsgDiv, formButtons.nextSibling);
  }


window.onload = () => {
  currentStep = 0;
  state = { tipoServico: null };
  renderStep();
};