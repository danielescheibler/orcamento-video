// Estrutura inicial do wizard
const steps = [
  {
    title: "Dados do Cliente",
    fields: [
      { label: "Nome", id: "nome", type: "text", required: true },
      { label: "E-mail para envio do orçamento", id: "email", type: "email", required: true }
    ]
  },
  {
    title: "Detalhes do Vídeo",
    fields: [
      { label: "Duração do vídeo final (minutos)", id: "duracao", type: "number", min: 1, max: 10, step: 0.1, required: true },
      { label: "Deseja legendas personalizadas?", id: "legendaPersonalizada", type: "checkbox" }
    ]
  },
  {
    title: "Extras",
    fields: [
      { label: "Elementos gráficos animados?", id: "elementosGraficos", type: "checkbox" },
      { label: "Entrega urgente (até 2 dias)?", id: "urgente", type: "checkbox" },
      { label: "Revisão adicional?", id: "revisao", type: "checkbox" }
    ]
  },
  {
    title: "Resumo e Confirmação",
    fields: []
  }
];

const valores = {
  base: 120,
  minutoExtra: 30,
  legendaPersonalizada: 40,
  elementosGraficos: 50,
  urgente: 70,
  revisao: 40
};

let currentStep = 0;
const formState = {};

// Renderiza o formulário de acordo com a etapa
function renderStep() {
  const wizard = document.getElementById('form-wizard');
  wizard.innerHTML = "";
  const step = steps[currentStep];

  const h2 = document.createElement('h2');
  h2.textContent = step.title;
  wizard.appendChild(h2);

  const form = document.createElement('form');
  form.id = "main-form";
  step.fields.forEach(f => {
    const label = document.createElement('label');
    label.textContent = f.label;
    label.htmlFor = f.id;
    form.appendChild(label);

    let input;
    if (f.type === 'checkbox') {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.id = f.id;
      input.checked = formState[f.id] || false;
    } else {
      input = document.createElement('input');
      input.type = f.type;
      input.id = f.id;
      input.value = formState[f.id] !== undefined ? formState[f.id] : '';
      if (f.min) input.min = f.min;
      if (f.max) input.max = f.max;
      if (f.step) input.step = f.step;
      if (f.required) input.required = true;
    }
    form.appendChild(input);
  });

  if (currentStep > 0) {
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.textContent = 'Voltar';
    prevBtn.onclick = () => { currentStep--; renderStep(); };
    form.appendChild(prevBtn);
  }

  if (currentStep < steps.length - 1) {
    const nextBtn = document.createElement('button');
    nextBtn.type = 'submit';
    nextBtn.textContent = 'Próximo';
    form.appendChild(nextBtn);
  } else {
    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Calcular Orçamento';
    form.appendChild(submitBtn);
  }

  form.onsubmit = function (e) {
    e.preventDefault();
    // Salva o estado dos campos
    step.fields.forEach(f => {
      if (f.type === 'checkbox') {
        formState[f.id] = document.getElementById(f.id).checked;
      } else {
        formState[f.id] = document.getElementById(f.id).value;
      }
    });
    if (currentStep < steps.length - 1) {
      currentStep++;
      renderStep();
    } else {
      calcularOrcamento();
    }
  };

  wizard.appendChild(form);
}

function calcularOrcamento() {
  let total = valores.base;
  const min = parseFloat(formState.duracao) || 0;
  if (min > 1.5) {
    total += Math.ceil(min - 1.5) * valores.minutoExtra;
  }
  if (formState.legendaPersonalizada) total += valores.legendaPersonalizada;
  if (formState.elementosGraficos) total += valores.elementosGraficos;
  if (formState.urgente) total += valores.urgente;
  if (formState.revisao) total += valores.revisao;

  const resumo = `
    <h2>Resumo do Orçamento</h2>
    <p><b>Nome:</b> ${formState.nome}</p>
    <p><b>E-mail:</b> ${formState.email}</p>
    <p><b>Duração:</b> ${formState.duracao} min</p>
    <p><b>Legenda personalizada:</b> ${formState.legendaPersonalizada ? 'Sim' : 'Não'}</p>
    <p><b>Elementos gráficos:</b> ${formState.elementosGraficos ? 'Sim' : 'Não'}</p>
    <p><b>Entrega urgente:</b> ${formState.urgente ? 'Sim' : 'Não'}</p>
    <p><b>Revisão adicional:</b> ${formState.revisao ? 'Sim' : 'Não'}</p>
    <h3>Total: <span style="color:#09BC8A">R$ ${total}</span></h3>
    <button id="baixarPdf">Baixar PDF</button>
    <!-- Aqui você pode implementar o envio por e-mail futuramente -->
  `;
  document.getElementById('form-wizard').innerHTML = resumo;
  document.getElementById('baixarPdf').onclick = gerarPdf;
}

function gerarPdf() {
  // Aqui você pode usar jsPDF para gerar PDF com as informações
  alert('Função PDF ainda não implementada. Veja jsPDF para adicionar!');
  // Exemplo:
  // const doc = new jsPDF();
  // doc.text("Orçamento...", 10, 10);
  // doc.save("orcamento.pdf");
}

// Inicializa o formulário
renderStep();