let currentStep = 0;
let state = { tipoServico: null };

function minutosParaSegundos(str) {
  if (!str) return 0;
  let m = str.match(/(\d+)[^\d]+(\d+)/);
  if (m) return parseInt(m[1],10)*60 + parseInt(m[2],10);
  m = str.match(/(\d+)/g);
  if (m && m.length === 1) return parseInt(m[0],10)*60;
  if (m && m.length === 2) return parseInt(m[0],10)*60 + parseInt(m[1],10);
  return 0;
}

function calcularValorVideo(state) {
  let valorBase = 100, valorEfeitos = 0, valorLegenda = 0, valorTotal = 0;
  let totalSegFinal = minutosParaSegundos(state.duracaoFinal);
  if (totalSegFinal > 90 && totalSegFinal <= 300) valorBase = 150;
  else if (totalSegFinal > 300) valorBase = 300;
  if (state.efeitosAnimacoes === 'simples') valorEfeitos = 50;
  if (state.efeitosAnimacoes === 'complexos') valorEfeitos = 80;
  valorLegenda = state.legenda === 'sim' ? 20 : 0;
  valorTotal = valorBase + valorEfeitos + valorLegenda;
  if (state.prazoEntrega) {
    let dataEntrega = new Date(state.prazoEntrega);
    let hoje = new Date();
    let dias = Math.ceil((dataEntrega - hoje) / (1000 * 60 * 60 * 24));
    if (dias < 4) valorTotal *= 2;
  }
  return valorTotal.toFixed(2).replace('.', ',');
}
function calcularValorMotion(state) {
  if (Number(state.tempoFinal) > 5) return 'Sob análise';
  return '200,00';
}

const steps = [
  function stepTipoServico(state) {
    return `
      <div class="step active">
        <label for="tipoServico">Qual tipo de serviço você deseja?</label>
        <select id="tipoServico" required>
          <option value="" disabled ${!state.tipoServico ? 'selected' : ''}>Selecione...</option>
          <option value="video" ${state.tipoServico === 'video' ? 'selected' : ''}>Edição de Vídeos</option>
          <option value="motion" ${state.tipoServico === 'motion' ? 'selected' : ''}>Motion Design</option>
        </select>
        <button class="next" type="button" id="to-next-servico">Continuar</button>
      </div>
    `;
  },
  function stepNomeEmail(state) {
    return `
      <div class="step active">
        <label for="nome">Seu nome:</label>
        <input type="text" id="nome" value="${state.nome || ''}" required>
        <label for="email">Seu e-mail:</label>
        <input type="email" id="email" value="${state.email || ''}" required>
        <button class="next" type="button" id="to-step2">Próxima etapa</button>
      </div>
    `;
  },
  function stepVideoQuestions(state) {
    return `
      <div class="step active">
        <label>1. O que você deseja comunicar? Qual seu público-alvo?</label>
        <textarea id="mensagemPublico" rows="2" required>${state.mensagemPublico || ''}</textarea>

        <label>2. Duração do vídeo bruto:</label>
        <input type="text" id="duracaoBruto" placeholder="Ex: 5min" value="${state.duracaoBruto || ''}" required>

        <label>Duração do vídeo final:</label>
        <input type="text" id="duracaoFinal" placeholder="Ex: 1min30s" value="${state.duracaoFinal || ''}" required>

        <label>3. Tem algum estilo específico de edição em mente? Envie 2 links de referência:</label>
        <input type="url" id="ref1" placeholder="Link 1" value="${state.ref1 || ''}" required>
        <input type="url" id="ref2" placeholder="Link 2" value="${state.ref2 || ''}" required>

        <label>4. Efeitos visuais e animações?</label>
        <select id="efeitosAnimacoes">
          <option value="" disabled ${!state.efeitosAnimacoes ? 'selected' : ''}>Selecione...</option>
          <option value="nao" ${state.efeitosAnimacoes === 'nao' ? 'selected' : ''}>Não</option>
          <option value="simples" ${state.efeitosAnimacoes === 'simples' ? 'selected' : ''}>Simples (animação de textos)</option>
          <option value="complexos" ${state.efeitosAnimacoes === 'complexos' ? 'selected' : ''}>Complexos (efeitos especiais, objetos, cenário)</option>
        </select>
        ${(state.efeitosAnimacoes === 'simples' || state.efeitosAnimacoes === 'complexos') ? `
          <div class="extra-options" style="margin-bottom:2px;">
            <label>Descreva o tipo de efeito/animação desejado:</label>
            <textarea id="descEfeitos" rows="2" required>${state.descEfeitos || ''}</textarea>
            <div style="color:#40849e;font-weight:600;margin-top:6px;">
              Orçamento estimado, sujeito a análise detalhada conforme complexidade.
            </div>
          </div>
        ` : ''}

        <label>5. Precisa de legendas?</label>
        <select id="legenda">
          <option value="" disabled ${!state.legenda ? 'selected' : ''}>Selecione...</option>
          <option value="nao" ${state.legenda === 'nao' ? 'selected' : ''}>Não</option>
          <option value="sim" ${state.legenda === 'sim' ? 'selected' : ''}>Sim</option>
        </select>

        <label>6. Possui identidade visual?</label>
        <select id="identidadeVisual">
          <option value="" disabled ${!state.identidadeVisual ? 'selected' : ''}>Selecione...</option>
          <option value="nao" ${state.identidadeVisual === 'nao' ? 'selected' : ''}>Não</option>
          <option value="sim" ${state.identidadeVisual === 'sim' ? 'selected' : ''}>Sim</option>
        </select>
        ${state.identidadeVisual === 'sim' ? `
          <div class="extra-options" style="margin-bottom:2px;">
            <label>Conte mais sobre sua identidade visual:</label>
            <textarea id="descIdentidade" rows="2" required>${state.descIdentidade || ''}</textarea>
            <div style="color:#40849e;font-size:0.98em;margin-top:6px;">
              <strong>Lembrete:</strong> envie os arquivos por e-mail após aprovar o orçamento.
            </div>
          </div>
        ` : ''}

       <label>7. Prazo de entrega <span style="font-weight:400">(mínimo 4 dias)</span>:</label>
       <input type="date" id="prazoEntrega" value="${state.prazoEntrega || ''}" required>

        <button class="back" type="button" id="to-step1">Voltar</button>
        <button class="next" type="button" id="to-stepResumo">Ver orçamento</button>
      </div>
    `;
  },
  function stepMotionQuestions(state) {
    return `
      <div class="step active">
        <label>1. O que você deseja comunicar? Qual seu público-alvo?</label>
        <textarea id="mensagemPublico" rows="2" required>${state.mensagemPublico || ''}</textarea>

        <label>2. Tempo final do vídeo (segundos):</label>
        <input type="number" id="tempoFinal" placeholder="ex: 10" min="1" max="600" value="${state.tempoFinal || ''}" required>

        <label>3. Tem algum estilo específico em mente? Envie 2 links de referência:</label>
        <input type="url" id="ref1" placeholder="Link 1" value="${state.ref1 || ''}" required>
        <input type="url" id="ref2" placeholder="Link 2" value="${state.ref2 || ''}" required>

        <label>4. Possui identidade visual?</label>
        <select id="identidadeVisualMotion">
          <option value="" disabled ${!state.identidadeVisualMotion ? 'selected' : ''}>Selecione...</option>
          <option value="nao" ${state.identidadeVisualMotion === 'nao' ? 'selected' : ''}>Não</option>
          <option value="sim" ${state.identidadeVisualMotion === 'sim' ? 'selected' : ''}>Sim</option>
        </select>
        ${state.identidadeVisualMotion === 'sim' ? `
          <div class="extra-options" style="margin-bottom:2px;">
            <label>Conte mais sobre sua identidade visual (ou envie depois):</label>
            <textarea id="descIdentidadeMotion" rows="2" required>${state.descIdentidadeMotion || ''}</textarea>
            <div style="color:#40849e;font-size:0.98em;margin-top:6px;">
              <strong>Lembrete:</strong> envie os arquivos por e-mail após aprovar o orçamento.
            </div>
          </div>
        ` : ''}

        <label>5. Explique o que tem em mente para o vídeo:</label>
        <textarea id="descricao" rows="2" required>${state.descricao || ''}</textarea>

        <label>6. Prazo de entrega <span style="font-weight:400">(mínimo 5 dias)</span>:</label>
        <input type="date" id="prazoEntrega" value="${state.prazoEntrega || ''}" required>

        <button class="back" type="button" id="to-step1">Voltar</button>
        <button class="next" type="button" id="to-stepResumo">Ver orçamento</button>
      </div>
    `;
  },
  function stepResumo(state) {
    const isVideo = state.tipoServico === 'video';
    let orcamentoValor = '';
    let analise = false;
    if (isVideo) {
      let valorFinal = calcularValorVideo(state);
      orcamentoValor = `Valor estimado: <strong style="color:#40849e">R$ ${valorFinal}</strong>
      <div style="color:#40849e; font-size:0.95em; margin-top:4px;">
        Este valor é uma estimativa inicial e está sujeito a análise detalhada após o envio dos materiais.
      </div>`;
    } else {
      if (Number(state.tempoFinal) > 5) {
        analise = true;
        orcamentoValor = `
          <div style="color:#40849e;font-weight:600;font-size:1.07em;margin:10px 0 6px;">
            Para finalizar seu orçamento é necessária análise da sua solicitação, peço que me envie mais detalhes por <a href="mailto:danielescheibler@gmail.com" target="_blank">e-mail</a> ou <a href="https://wa.me/5551997523656" target="_blank">WhatsApp</a>.
          </div>
          <div style="text-align:center;margin:10px 0 4px;">
            <img src="http://localhost:3000/please.gif" alt="Aguardo mais detalhes" style="max-width:210px;width:100%;border-radius:7px;">
          </div>
        `;
      }
      else orcamentoValor = `Valor estimado: <strong style="color:#40849e">R$ 200,00</strong>`;
    }
    state.valorFinal = isVideo ? calcularValorVideo(state) : (analise ? 'Sob análise' : '200,00');

    return `
      <div class="step active" id="resumo-step">
        <h3 style="color:#40849e; text-align:left; margin-bottom:10px;">Resumo do orçamento</h3>
        <div id="resumo-visual" style="background:#f2f2f2;color:#0d1215;border-radius:7px;padding:10px 11px 4px;margin-bottom:8px; border:1px solid #40849e;">
          <strong>Nome:</strong> ${state.nome}<br>
          <strong>E-mail:</strong> ${state.email}<br>
          <strong>O que deseja comunicar/público:</strong> ${state.mensagemPublico}<br>
          ${isVideo ? `
            <strong>Duração bruto:</strong> ${state.duracaoBruto}<br>
            <strong>Duração final:</strong> ${state.duracaoFinal}<br>
            <strong>Referências:</strong>
            <ul>
              <li><a href="${state.ref1}" target="_blank">${state.ref1}</a></li>
              <li><a href="${state.ref2}" target="_blank">${state.ref2}</a></li>
            </ul>
            <strong>Efeitos visuais e animações:</strong> ${state.efeitosAnimacoes === 'simples' ? 'Simples' : state.efeitosAnimacoes === 'complexos' ? 'Complexos' : 'Não'}<br>
            ${(state.efeitosAnimacoes === 'simples' || state.efeitosAnimacoes === 'complexos') ? `<strong>Descrição dos efeitos:</strong> ${state.descEfeitos || ''}<br>` : ''}
            <strong>Legendas:</strong> ${state.legenda === 'sim' ? 'Sim' : 'Não'}<br>
            <strong>Identidade visual:</strong> ${state.identidadeVisual === 'sim' ? 'Sim' : 'Não'}<br>
            ${state.identidadeVisual === 'sim' ? `<strong>Descrição identidade:</strong> ${state.descIdentidade || ''}<br>` : ''}
            <strong>Prazo de entrega:</strong> ${state.prazoEntrega}<br>
          ` : `
            <strong>Tempo final:</strong> ${state.tempoFinal} segundos<br>
            <strong>Referências:</strong>
            <ul>
              <li><a href="${state.ref1}" target="_blank">${state.ref1}</a></li>
              <li><a href="${state.ref2}" target="_blank">${state.ref2}</a></li>
            </ul>
            <strong>Identidade visual:</strong> ${state.identidadeVisualMotion === 'sim' ? 'Sim' : 'Não'}<br>
            ${state.identidadeVisualMotion === 'sim' ? `<strong>Descrição identidade:</strong> ${state.descIdentidadeMotion || ''}<br>` : ''}
            <strong>Descrição:</strong> ${state.descricao}<br>
            <strong>Prazo de entrega:</strong> ${state.prazoEntrega}<br>
          `}
          ${orcamentoValor}
        </div>
        <div style="display:flex;justify-content:center;">
          <button class="next" type="button" id="enviar-orcamento-email" style="background:#09BC8A; color:#fff; border-radius:4px; margin-bottom:10px;">✉️ Enviar orçamento por e-mail</button>
        </div>
       </div>
    `;
  }
];

function renderStep() {
  const wizard = document.getElementById('wizard');
  let s = state.tipoServico, v = steps, stepIndex = currentStep;
  if (stepIndex === 0) {
    wizard.innerHTML = v[0](state);
    document.getElementById('tipoServico').onchange = e => { state.tipoServico = e.target.value; };
    document.getElementById('to-next-servico').onclick = () => {
      if (!state.tipoServico) { showResult("Escolha uma opção para continuar"); return; }
      currentStep = 1; renderStep();
    };
    return;
  }
  if (stepIndex === 1) {
    wizard.innerHTML = v[1](state);
    document.getElementById('nome').oninput = e => { state.nome = e.target.value; };
    document.getElementById('email').oninput = e => { state.email = e.target.value; };
    document.getElementById('to-step2').onclick = () => {
      if (!state.nome || !state.email) { showResult("Preencha nome e e-mail."); return; }
      currentStep = 2; renderStep();
    };
    return;
  }
  if (s === 'video') {
    if (stepIndex === 2) {
      wizard.innerHTML = v[2](state);
      document.getElementById('mensagemPublico').oninput = e => { state.mensagemPublico = e.target.value; };
      document.getElementById('duracaoBruto').oninput = e => { state.duracaoBruto = e.target.value; };
      document.getElementById('duracaoFinal').oninput = e => { state.duracaoFinal = e.target.value; };
      document.getElementById('ref1').oninput = e => { state.ref1 = e.target.value; };
      document.getElementById('ref2').oninput = e => { state.ref2 = e.target.value; };
      document.getElementById('efeitosAnimacoes').onchange = e => { state.efeitosAnimacoes = e.target.value; renderStep(); };
      if (state.efeitosAnimacoes === 'simples' || state.efeitosAnimacoes === 'complexos') {
        document.getElementById('descEfeitos').oninput = e => { state.descEfeitos = e.target.value; };
      }
      document.getElementById('legenda').onchange = e => { state.legenda = e.target.value; };
      document.getElementById('identidadeVisual').onchange = e => { state.identidadeVisual = e.target.value; renderStep(); };
      if (state.identidadeVisual === 'sim') {
        document.getElementById('descIdentidade').oninput = e => { state.descIdentidade = e.target.value; };
      }
      document.getElementById('prazoEntrega').oninput = e => { state.prazoEntrega = e.target.value; };
      document.getElementById('to-step1').onclick = () => { currentStep = 1; renderStep(); };
      document.getElementById('to-stepResumo').onclick = () => {
        if (!state.mensagemPublico || !state.duracaoBruto || !state.duracaoFinal || !state.ref1 || !state.ref2 || !state.efeitosAnimacoes || !state.legenda || !state.identidadeVisual || !state.prazoEntrega) {
          showResult("Preencha todos os campos obrigatórios.");
          return;
        }
        if ((state.efeitosAnimacoes === 'simples' || state.efeitosAnimacoes === 'complexos') && !state.descEfeitos) {
          showResult("Descreva os efeitos desejados!");
          return;
        }
        if (state.identidadeVisual === 'sim' && !state.descIdentidade) {
          showResult("Fale sobre sua identidade visual!");
          return;
        }
        currentStep = 4; renderStep();
      };
      return;
    }
  } else if (s === 'motion') {
    if (stepIndex === 2) {
      wizard.innerHTML = v[3](state);
      document.getElementById('mensagemPublico').oninput = e => { state.mensagemPublico = e.target.value; };
      document.getElementById('tempoFinal').oninput = e => { state.tempoFinal = e.target.value; };
      document.getElementById('ref1').oninput = e => { state.ref1 = e.target.value; };
      document.getElementById('ref2').oninput = e => { state.ref2 = e.target.value; };
      document.getElementById('identidadeVisualMotion').onchange = e => { state.identidadeVisualMotion = e.target.value; renderStep(); };
      if (state.identidadeVisualMotion === 'sim') {
        document.getElementById('descIdentidadeMotion').oninput = e => { state.descIdentidadeMotion = e.target.value; };
      }
      document.getElementById('descricao').oninput = e => { state.descricao = e.target.value; };
      document.getElementById('prazoEntrega').oninput = e => { state.prazoEntrega = e.target.value; };
      document.getElementById('to-step1').onclick = () => { currentStep = 1; renderStep(); };
      document.getElementById('to-stepResumo').onclick = () => {
        if (!state.mensagemPublico || !state.tempoFinal || !state.ref1 || !state.ref2 || !state.identidadeVisualMotion || !state.descricao || !state.prazoEntrega) {
          showResult("Preencha todos os campos obrigatórios.");
          return;
        }
        if (state.identidadeVisualMotion === 'sim' && !state.descIdentidadeMotion) {
          showResult("Fale sobre sua identidade visual!");
          return;
        }
        currentStep = 4; renderStep();
      };
      return;
    }
  }
  if (stepIndex === 4) {
    wizard.innerHTML = v[4](state);
    const btnEmail = document.getElementById('enviar-orcamento-email');
    if (btnEmail) btnEmail.onclick = async () => {
      showResult("Enviando orçamento por e-mail...");
      try {
        const resp = await fetch('http://localhost:3000/enviar-orcamento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state)
        });
        const json = await resp.json();
        if (resp.ok) {
          showResult("Orçamento enviado por e-mail", "#09BC8A");
          setTimeout(() => {
            currentStep = 0;
            state = { tipoServico: null };
            renderStep();
          }, 2000);
        } else {
          showResult("Erro ao enviar: " + (json.mensagem || "Tente novamente."), "#D8000C");
        }
      } catch (err) {
        showResult("Erro de conexão. Tente novamente.", "#D8000C");
      }
    };
  }
}

function showResult(msg, cor) {
  const res = document.getElementById('result');
  res.innerHTML = msg;
  res.style.color = cor || "#40849e";
  if (msg) setTimeout(() => { res.innerHTML = ""; }, 8000);
}

window.onload = () => {
  currentStep = 0;
  state = { tipoServico: null };
  renderStep();
};