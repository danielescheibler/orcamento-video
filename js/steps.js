import { calcularValor } from './orcamentoRules.js';

export const steps = [
  // 1. Tipo de Serviço (ADAPTADO PARA MOBILE, sem perder info desktop)
  function stepTipoServico(state) {
    const isMobile = window.innerWidth <= 600;
    if (isMobile) {
      return `
        <div class="main-question">Qual tipo de serviço você deseja?</div>
        <div class="main-options">
          <button class="option-btn" data-value="video">Edição de Vídeos</button>
          <button class="option-btn" data-value="motion">Motion Design</button>
        </div>
      `;
    }
    return `
      <div class="step active">
        <div class="step-title">Tipo de Serviço</div>
        <label for="tipoServico">Qual tipo de serviço você deseja?</label>
        <select id="tipoServico" required>
          <option value="" disabled ${!state.tipoServico ? 'selected' : ''}>Selecione...</option>
          <option value="video" ${state.tipoServico === 'video' ? 'selected' : ''}>Edição de Vídeos</option>
          <option value="motion" ${state.tipoServico === 'motion' ? 'selected' : ''}>Motion Design</option>
        </select>
      </div>
    `;
  },
  // 2. Dados pessoais
  function stepDadosPessoais(state) {
    return `
      <div class="step active">
        <div class="step-title">Dados pessoais</div>
        <label for="nome">Seu nome:</label>
        <input type="text" id="nome" value="${state.nome || ''}" required>
        <label for="email">Seu melhor e-mail:</label>
        <input type="email" id="email" value="${state.email || ''}" required>
      </div>
    `;
  },
  // 3. Público-alvo
  function stepPublicoAlvo(state) {
    return `
      <div class="step active">
        <div class="step-title">Público-alvo</div>
        <label for="mensagemPublico">O que você deseja comunicar?<br> Qual seu público-alvo?</label>
        <textarea id="mensagemPublico" rows="3" required>${state.mensagemPublico || ''}</textarea>
      </div>
    `;
  },
  // 4. Tempo de vídeo
  function stepTempoVideo(state) {
    if (state.tipoServico === "video") {
      return `
        <div class="step active">
          <div class="step-title">Tempo de vídeo</div>
          <label>Duração do vídeo bruto (em minutos):</label>
          <input type="number" id="duracaoBruto" placeholder="Ex: 5" min="1" max="600" step="any" value="${state.duracaoBruto || ''}" required>
          <label>Duração do vídeo final (em minutos):</label>
          <input type="number" id="duracaoFinal" placeholder="Ex: 1.5" min="1" max="600" step="any" value="${state.duracaoFinal || ''}" required>
          <div id="tempoNumerico-msg" class="form-validation-message" style="display:none;"></div>
        </div>
      `;
    } else {
      return `
        <div class="step active">
          <div class="step-title">Tempo de vídeo</div>
          <label>Tempo final do vídeo (em segundos):</label>
          <input type="number" id="tempoFinal" placeholder="ex: 30" min="1" max="600" value="${state.tempoFinal || ''}" required>
          <div id="tempoNumerico-msg" class="form-validation-message" style="display:none;"></div>
        </div>
      `;
    }
  },
  // 5. Referências
  function stepReferencias(state) {
    return `
      <div class="step active">
        <div class="step-title">Referências</div>
        <div class="dica">
          Indique 2 links de vídeos ou animações que você gosta ou gostaria de se inspirar.<br>
          <b>Por quê?</b> Isso ajuda a entender seu gosto, expectativa de ritmo, cores, linguagem ou efeitos desejados!
        </div>
        <input type="url" id="ref1" placeholder="Link 1" value="${state.ref1 || ''}" required>
        <input type="url" id="ref2" placeholder="Link 2" value="${state.ref2 || ''}" required>
      </div>
    `;
  },
  // 6. Recursos Visuais (sem descrição de efeitos)
  function stepRecursosVisuais(state) {
    if (state.tipoServico === "video") {
      return `
        <div class="step active">
          <div class="step-title">Recursos Visuais</div>
          <label>Efeitos e animações</label>
          <div class="dica">Deseja animações de texto, efeitos especiais, transições ou algo diferente?</div>
          <select id="efeitosAnimacoes">
            <option value="" disabled ${!state.efeitosAnimacoes ? 'selected' : ''}>Selecione...</option>
            <option value="nao" ${state.efeitosAnimacoes === 'nao' ? 'selected' : ''}>Não</option>
            <option value="simples" ${state.efeitosAnimacoes === 'simples' ? 'selected' : ''}>Simples (animação de textos)</option>
            <option value="complexos" ${state.efeitosAnimacoes === 'complexos' ? 'selected' : ''}>Complexos (efeitos especiais, objetos, cenários)</option>
          </select>
          <label>Legendas</label>
          <div class="dica">Precisa de legendas inseridas no vídeo? <br>(as legendas sempre passam por revisão)</div>
          <select id="legenda">
            <option value="" disabled ${!state.legenda ? 'selected' : ''}>Selecione...</option>
            <option value="nao" ${state.legenda === 'nao' ? 'selected' : ''}>Não</option>
            <option value="sim" ${state.legenda === 'sim' ? 'selected' : ''}>Sim</option>
          </select>
        </div>
      `;
    } else {
      return `
        <div class="step active">
          <div class="step-title">Recursos Visuais</div>
          <label>Explique o que tem em mente para o vídeo:</label>
          <div class="dica">Conte a ideia, roteiro ou resultado esperado para a animação.</div>
          <textarea id="descricao" rows="3" required>${state.descricao || ''}</textarea>
        </div>
      `;
    }
  },
  // 7. Identidade visual
  function stepIdentidadeVisual(state) {
    if (state.tipoServico === "video") {
      return `
        <div class="step active">
          <div class="step-title">Identidade visual</div>
          <div class="dica">Tem logo, paleta de cores ou fontes próprias? Se sim, descreva ou envie depois por e-mail.</div>
          <select id="identidadeVisual">
            <option value="" disabled ${!state.identidadeVisual ? 'selected' : ''}>Selecione...</option>
            <option value="nao" ${state.identidadeVisual === 'nao' ? 'selected' : ''}>Não</option>
            <option value="sim" ${state.identidadeVisual === 'sim' ? 'selected' : ''}>Sim</option>
          </select>
          ${state.identidadeVisual === 'sim' ? `
            <label>Conte mais sobre sua identidade visual:</label>
            <textarea id="descIdentidade" rows="2" required>${state.descIdentidade || ''}</textarea>
          ` : ''}
        </div>
      `;
    } else {
      return `
        <div class="step active">
          <div class="step-title">Identidade visual</div>
          <div class="dica">Tem logo, paleta de cores ou fontes próprias? Se sim, descreva ou envie depois por e-mail.</div>
          <select id="identidadeVisualMotion">
            <option value="" disabled ${!state.identidadeVisualMotion ? 'selected' : ''}>Selecione...</option>
            <option value="nao" ${state.identidadeVisualMotion === 'nao' ? 'selected' : ''}>Não</option>
            <option value="sim" ${state.identidadeVisualMotion === 'sim' ? 'selected' : ''}>Sim</option>
          </select>
          ${state.identidadeVisualMotion === 'sim' ? `
            <label>Conte mais sobre sua identidade visual:</label>
            <textarea id="descIdentidadeMotion" rows="2" required>${state.descIdentidadeMotion || ''}</textarea>
          ` : ''}
        </div>
      `;
    }
  },
  // 8. Resumo e envio
  function stepResumoEnvio(state) {
    const calc = calcularValor(state);
    // Garante que sempre exibe "Valor estimado: R$"
    const valorTexto = `Valor estimado: R$ ${calc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const detalhesExtras = `
      <div style="margin-top:10px;">
        <b>Inclui:</b> ${calc.revisoes} revisão${calc.revisoes > 1 ? 's' : ''}<br>
        <b>Prazo estimado:</b> ${calc.prazo} dias úteis<br>
        ${calc.urgente ? '<b style="color:#b90000;">Taxa de urgência aplicada (+30%)</b><br>' : ''}
        ${calc.legendaIncluiRevisao ? '<b>Legenda revisada incluída!</b><br>' : ''}
      </div>
    `;

    let mensagemAvaliacao = `
      <div style="color:#40849e; font-size:0.92em; margin-top:8px;">
        Este valor é uma estimativa inicial e pode variar conforme a complexidade do projeto.<br>
        <br>
        Entre em contato para que eu possa fazer uma análise detalhada, e lhe enviar um orçamento personalizado. ✨
      </div>
    `;
    let gifMensagemHTML = '';

    let resumoHtml = `
      <div class="step active">
        <div class="step-title">Resumo do orçamento</div>
        <div class="resumo-quadro" style="background:#f2f2f2;color:#0d1215;border-radius:7px;padding:10px 11px;margin-bottom:12px; border:1px solid #40849e;">
          <strong>Nome:</strong> ${state.nome || ''}<br>
          <strong>E-mail:</strong> ${state.email || ''}<br>
          <strong>Público-alvo/objetivo:</strong> ${state.mensagemPublico || ''}<br>
    `;
    if(state.tipoServico === "video") {
      resumoHtml += `
        <strong>Duração bruto:</strong> ${state.duracaoBruto || ''}<br>
        <strong>Duração final:</strong> ${state.duracaoFinal || ''}<br>
      `;
    } else {
      resumoHtml += `
        <strong>Tempo final:</strong> ${state.tempoFinal || ''} segundos<br>
      `;
    }
    resumoHtml += `
        <strong>Referências:</strong>
        <ul>
          <li><a href="${state.ref1 || '#'}" target="_blank">${state.ref1 || ''}</a></li>
          <li><a href="${state.ref2 || '#'}" target="_blank">${state.ref2 || ''}</a></li>
        </ul>
    `;
    if(state.tipoServico === "video") {
      resumoHtml += `
        <strong>Efeitos:</strong> ${state.efeitosAnimacoes || ''}<br>
        <strong>Legenda:</strong> ${state.legenda || ''}<br>
        <strong>Identidade visual:</strong> ${state.identidadeVisual || ''}<br>
        ${state.identidadeVisual === 'sim' ? `<strong>Descrição identidade:</strong> ${state.descIdentidade || ''}<br>` : ''}
      `;
    } else {
      resumoHtml += `
        <strong>Identidade visual:</strong> ${state.identidadeVisualMotion || ''}<br>
        ${state.identidadeVisualMotion === 'sim' ? `<strong>Descrição identidade:</strong> ${state.descIdentidadeMotion || ''}<br>` : ''}
        <strong>Descrição:</strong> ${state.descricao || ''}<br>
      `;
    }
    resumoHtml += `
      <div style="margin-top:14px;">
        <strong style="color:#40849e;font-size:1.2em;">${valorTexto}</strong>
        ${detalhesExtras}
      </div>
      </div>
      <div class="form-buttons" style="justify-content:center;gap:12px;">
        <button class="back" id="voltar-btn" type="button">Voltar</button>
        <button class="next" id="enviar-btn" type="button">Enviar Orçamento<br> por e-mail</button>
      </div>
      <div id="form-validation-message-container"></div>
      ${gifMensagemHTML || mensagemAvaliacao}
    </div>
    `;
    return resumoHtml;
  }
];