function calcularValor(state) {
  if (state.tipoServico === 'motion') return 1200;
  if (state.tipoServico === 'video') {
    if (state.efeitosAnimacoes === 'complexos') return 900;
    return 500;
  }
  return 400;
}

export const steps = [
  // 1. Tipo de Serviço
  function stepTipoServico(state) {
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
          <div class="dica">Precisa de legendas inseridas no vídeo?</div>
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
    const valor = calcularValor(state).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const gifPath = "assets/please.gif";

    let mensagemAvaliacao = '';
    let gifMensagemHTML = '';

    if (state.tipoServico === 'motion') {
      gifMensagemHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 18px; margin: 18px 0;">
          <div style="color:#40849e; font-size:1em; text-align:left;">
            Este valor é uma aproximação.<br>
            Para orçamento final, envie para a editora analisar seu projeto detalhadamente!
          </div>
          <img src="${gifPath}" alt="Por favor, envie para avaliação" style="width:80px;max-width:90vw;border-radius:7px;"/>
        </div>
      `;
    } else if (state.tipoServico === 'video' && state.efeitosAnimacoes === 'complexos') {
      gifMensagemHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 18px; margin: 18px 0;">
          <div class="aviso-menor">
            Como você selecionou "efeitos e animações complexas",
            este valor é apenas uma referência.<br>
            Envie para a editora analisar e fornecer uma proposta personalizada.
          </div>
          <img src="${gifPath}" alt="Por favor, envie para avaliação" style="width:80px;max-width:90vw;border-radius:7px;"/>
        </div>
      `;
    } else {
      mensagemAvaliacao = `
        <div style="color:#40849e; font-size:0.92em; margin-top:8px;">
          Este valor é uma aproximação e pode variar após avaliação detalhada da editora. ✨
        </div>
      `;
      gifMensagemHTML = '';
    }

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
        <strong style="color:#40849e;font-size:1.2em;">Valor estimado: ${valor}</strong>
      </div>
      </div>
      <div class="form-buttons" style="justify-content:center;gap:12px;">
        <button class="back" id="voltar-btn" type="button">Voltar</button>
        <button class="next" id="enviar-btn" type="button">Enviar Orçamento</button>
      </div>
      <div id="form-validation-message-container"></div>
      ${gifMensagemHTML || mensagemAvaliacao}
    </div>
    `;
    return resumoHtml;
  }
];