export async function enviarOrcamento(dados) {
  if (!dados.email || !dados.nome || !dados.tipoServico) {
    return { ok: false, mensagem: 'Quer orçamento? Preenche aí primeiro. 👀' };
  }
  const payload = {
    ...dados,
    efeitosAnimacoes: dados.efeitosAnimacoes || '',
    legenda: dados.legenda || '',
    identidadeVisual: dados.identidadeVisual || '',
    identidadeVisualMotion: dados.identidadeVisualMotion || '',
    descIdentidade: dados.descIdentidade || '',
    descIdentidadeMotion: dados.descIdentidadeMotion || '',
    descricao: dados.descricao || '',
    duracaoBruto: dados.duracaoBruto || '',
    duracaoFinal: dados.duracaoFinal || '',
    tempoFinal: dados.tempoFinal || '',
    ref1: dados.ref1 || '',
    ref2: dados.ref2 || '',
    mensagemPublico: dados.mensagemPublico || '',
    nome: dados.nome || '',
    email: dados.email || '',
  };

  try {
    const response = await fetch('/enviar-orcamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    return result;
  } catch (e) {
    return { ok: false, mensagem: 'Erro de conexão!' };
  }
}