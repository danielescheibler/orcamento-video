import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(cors());

// Serve diretório public
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'danielescheibler@gmail.com',
    pass: 'yfci gdkt kjxn trkb'
  }
});

function minutosParaSegundos(str) {
  if (!str) return 0;
  let m = str.match(/(\d+)[^\d]+(\d+)/);
  if (m) return parseInt(m[1],10)*60 + parseInt(m[2],10);
  m = str.match(/(\d+)/g);
  if (m && m.length === 1) return parseInt(m[0],10)*60;
  if (m && m.length === 2) return parseInt(m[0],10)*60 + parseInt(m[1],10);
  return 0;
}

function calcularValorVideo(dados) {
  let valorBase = 100, valorEfeitos = 0, valorLegenda = 0, valorTotal = 0;
  let totalSegFinal = minutosParaSegundos(dados.duracaoFinal);
  if (totalSegFinal > 90 && totalSegFinal <= 300) valorBase = 150;
  else if (totalSegFinal > 300) valorBase = 300;
  if (dados.efeitosAnimacoes === 'simples') valorEfeitos = 50;
  if (dados.efeitosAnimacoes === 'complexos') valorEfeitos = 80;
  valorLegenda = dados.legenda === 'sim' ? 20 : 0;
  valorTotal = valorBase + valorEfeitos + valorLegenda;
  if (dados.prazoEntrega) {
    let dataEntrega = new Date(dados.prazoEntrega);
    let hoje = new Date();
    let dias = Math.ceil((dataEntrega - hoje) / (1000 * 60 * 60 * 24));
    if (dias < 4) valorTotal *= 2;
  }
  return valorTotal.toFixed(2).replace('.', ',');
}

function calcularValorMotion(dados) {
  const tempo = Number(dados.tempoFinal);
  if (isNaN(tempo) || tempo <= 0) return 'A definir';
  if (tempo <= 5) return '200,00';
  if (tempo <= 10) return '400,00';
  if (tempo <= 20) return '600,00';
  return '800,00';
}

function resumoOrcamento(dados) {
  let s = dados.tipoServico;
  let linhas = [];
  linhas.push(`<strong>Nome:</strong> ${dados.nome || ''}`);
  linhas.push(`<strong>E-mail:</strong> ${dados.email || ''}`);
  linhas.push(`<strong>O que deseja comunicar/público:</strong> ${dados.mensagemPublico || ''}`);

  if (s === 'video') {
    linhas.push(`<strong>Duração bruto:</strong> ${dados.duracaoBruto || ''}`);
    linhas.push(`<strong>Duração final:</strong> ${dados.duracaoFinal || ''}`);
    linhas.push(`<strong>Referências:</strong><ul><li>${dados.ref1 || ''}</li><li>${dados.ref2 || ''}</li></ul>`);
    linhas.push(`<strong>Efeitos visuais e animações:</strong> ${
      dados.efeitosAnimacoes === 'simples' ? 'Simples' :
      dados.efeitosAnimacoes === 'complexos' ? 'Complexos' : 'Não'
    }`);
    linhas.push(`<strong>Legenda:</strong> ${dados.legenda === 'sim' ? 'Sim' : 'Não'}`);
    linhas.push(`<strong>Identidade visual:</strong> ${dados.identidadeVisual === 'sim' ? 'Sim' : 'Não'}`);
    if (dados.identidadeVisual === 'sim') {
      linhas.push(`<strong>Descrição identidade:</strong> ${dados.descIdentidade || ''}`);
    }
    linhas.push(`<strong>Valor estimado:</strong> R$ ${calcularValorVideo(dados)}`);
  } else if (s === 'motion') {
    linhas.push(`<strong>Tempo final:</strong> ${dados.tempoFinal || ''} segundos`);
    linhas.push(`<strong>Referências:</strong><ul><li>${dados.ref1 || ''}</li><li>${dados.ref2 || ''}</li></ul>`);
    linhas.push(`<strong>Identidade visual:</strong> ${dados.identidadeVisualMotion === 'sim' ? 'Sim' : 'Não'}`);
    if (dados.identidadeVisualMotion === 'sim') {
      linhas.push(`<strong>Descrição identidade:</strong> ${dados.descIdentidadeMotion || ''}`);
    }
    linhas.push(`<strong>Descrição:</strong> ${dados.descricao || ''}`);

    const valor = calcularValorMotion(dados);
    linhas.push(`<strong>Valor estimado:</strong> R$ ${valor}`);
    linhas.push(`
      <div style="color:#40849e;font-weight:600;font-size:1.07em;margin:10px 0 6px;">
        Este valor é uma estimativa inicial e pode variar conforme a complexidade do projeto.<br>
        Entre em contato para um orçamento personalizado! ✨<br>
        <a href="mailto:danielescheibler@gmail.com" target="_blank">E-mail</a> ou <a href="https://wa.me/5551997523656" target="_blank">WhatsApp</a>
      </div>
    `);
  }
  return linhas.join('<br>');
}

app.post('/enviar-orcamento', async (req, res) => {
  try {
    const dados = req.body;
    if (!dados.email || !dados.nome || !dados.tipoServico) {
      return res.status(400).json({ ok: false, mensagem: 'Campos obrigatórios faltando!' });
    }
    const resumo = resumoOrcamento(dados);

    await transporter.sendMail({
      from: '"Orçamento" <danielescheibler@gmail.com>',
      to: dados.email,
      bcc: 'danielescheibler@gmail.com',
      replyTo: dados.email,
      subject: `Aqui está seu orçamento ${dados.nome || ''}`,
      html: `
        <div style="max-width:540px;margin:0 auto;border-radius:10px;padding:32px 24px;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;box-shadow:0 2px 8px #0002;">
          <div style="text-align:center;margin-bottom:22px;">
            <h2 style="color:#40849e;margin:0 0 10px;font-size:1.5em;">Oie ${dados.nome || ''}, pediu um orçamento? 
            <br>Aqui está ✨😉</h2>
          </div>
          <div style="background:#fff;border-radius:8px;padding:18px 16px 12px;border:1px solid #c5e7f7;margin-bottom:18px;color:#222;font-size:1.08em;">
            ${resumo}
          </div>
          <div style="margin-top:24px;text-align:center;font-size:1em;color:#222;">
            Obrigada pelo interesse!<br>
            Se quiser dar início à edição, me encaminha esse e-mail contendo o orçamento junto com os seus arquivos, ou pode me enviar no Whatsapp também,
            <a href="https://wa.me/5551997523656" style="text-decoration:none;display:inline-block;margin-left:6px;">
              <span style="color:#40849e;font-weight:600;">clicando aqui</span>
              <img src="https://img.icons8.com/color/48/000000/whatsapp--v1.png" alt="WhatsApp" width="15" height="15" style="vertical-align:middle;margin-right:4px;">
            </a>
          </div>
          <div style="margin-top:28px;text-align:center;">
            <span style="color:#40849e;font-weight:600;">Me siga nas redes:</span><br>
            <a href="https://www.instagram.com/danieles.designer/" target="_blank" style="margin:0 6px;display:inline-block;">
              <img src="https://img.icons8.com/color/48/000000/instagram-new.png" alt="Instagram" width="22" height="22" style="vertical-align:middle;">
            </a>
            <a href="https://www.linkedin.com/in/danielescheibler/" target="_blank" style="margin:0 6px;display:inline-block;">
              <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="Linkedin" width="22" height="22" style="vertical-align:middle;">
            </a>
            <a href="https://github.com/danielescheibler" target="_blank" style="margin:0 6px;display:inline-block;">
              <img src="https://img.icons8.com/ios-filled/50/40849e/github.png" alt="Github" width="22" height="22" style="vertical-align:middle;">
            </a>
          </div>
          <div style="margin-top:18px;text-align:center;">
            <small style="color:#40849e;">Desenvolvido por Daniele Scheibler</small>
          </div>
        </div>
      `
    });

    res.json({ ok: true, mensagem: 'Orçamento enviado com sucesso!' });
  } catch (e) {
    res.status(500).json({ ok: false, mensagem: 'Erro ao enviar orçamento. ' + e.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});