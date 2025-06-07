export function renderProgressBar(currentStep, totalSteps = 8) {
  let progressHTML = '';
  for(let i=0; i<totalSteps; i++) {
    let stepClass = '';
    if (i < currentStep) stepClass = "completed";
    else if (i === currentStep) stepClass = "active";
    progressHTML += `
      <div class="progress-step ${stepClass}">
        <div class="progress-circle"></div>
      </div>
    `;
  }
  const progressBar = document.getElementById('progress-bar');
  if(progressBar) progressBar.innerHTML = progressHTML;
}