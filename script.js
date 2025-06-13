// Configuração do Manômetro
const manometroCanvas = document.getElementById('manometro');
const manometroCtx = manometroCanvas.getContext('2d');
const psiRange = document.getElementById('psiRange');
const psiValue = document.getElementById('psiValue');

const centerX = manometroCanvas.width / 2;
const centerY = manometroCanvas.height / 2;
const radius = 80;

function drawDial() {
  manometroCtx.clearRect(0, 0, manometroCanvas.width, manometroCanvas.height);

  // Fundo circular
  let gradient = manometroCtx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius);
  gradient.addColorStop(0, '#ff3b3b');
  gradient.addColorStop(1, '#330000');
  manometroCtx.fillStyle = gradient;
  manometroCtx.beginPath();
  manometroCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  manometroCtx.fill();

  // Círculo interno
  manometroCtx.fillStyle = '#121212';
  manometroCtx.beginPath();
  manometroCtx.arc(centerX, centerY, radius * 0.85, 0, Math.PI * 2);
  manometroCtx.fill();

  // Marcações
  manometroCtx.strokeStyle = '#ff3b3b';
  manometroCtx.lineWidth = 2;
  for (let i = 0; i <= 200; i += 20) {
    let angle = (Math.PI * 1.5) * (i / 200) + Math.PI * 0.75;
    let innerRadius = radius * 0.8;
    let outerRadius = radius * 0.9;
    let x1 = centerX + innerRadius * Math.cos(angle);
    let y1 = centerY + innerRadius * Math.sin(angle);
    let x2 = centerX + outerRadius * Math.cos(angle);
    let y2 = centerY + outerRadius * Math.sin(angle);
    manometroCtx.beginPath();
    manometroCtx.moveTo(x1, y1);
    manometroCtx.lineTo(x2, y2);
    manometroCtx.stroke();

    // Número
    manometroCtx.fillStyle = '#ff3b3b';
    manometroCtx.font = '12px Segoe UI';
    manometroCtx.textAlign = 'center';
    manometroCtx.textBaseline = 'middle';
    let numRadius = radius * 0.7;
    let xNum = centerX + numRadius * Math.cos(angle);
    let yNum = centerY + numRadius * Math.sin(angle);
    manometroCtx.fillText(i, xNum, yNum);
  }
}

function drawPointer(psi) {
  let maxPsi = 200;
  let angle = (Math.PI * 1.5) * (psi / maxPsi) + Math.PI * 0.75;

  manometroCtx.strokeStyle = '#ff3b3b';
  manometroCtx.lineWidth = 3;
  manometroCtx.beginPath();
  manometroCtx.moveTo(centerX, centerY);
  let pointerLength = radius * 0.75;
  manometroCtx.lineTo(centerX + pointerLength * Math.cos(angle), centerY + pointerLength * Math.sin(angle));
  manometroCtx.stroke();

  // Círculo central
  manometroCtx.fillStyle = '#ff3b3b';
  manometroCtx.beginPath();
  manometroCtx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  manometroCtx.fill();
}

function updateManometro(value) {
  drawDial();
  drawPointer(value);
  psiValue.textContent = value;
}

psiRange.addEventListener('input', (e) => {
  updateManometro(Number(e.target.value));
});

// Inicializa o manômetro
updateManometro(50);

// Configuração do Foguete
const canvas = document.getElementById("canvasFoguete");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("btnDisparo");
const maxAltitudeEl = document.getElementById("maxAltitude");
const maxVelocityEl = document.getElementById("maxVelocity");

let fogueteY = 500;
let velocidadeAtual = 0;
let velocidadeMaxima = 0;
let gravidade = 9.8;
let emVoo = false;
let subindo = true;
let alturaMax = 0;
let hoverLiberado = false;
let hoverX = 0;
let hoverY = 0;
let hoverAtivo = false;
let linhaMax = null;

function resetarSimulacao() {
  fogueteY = 500;
  emVoo = false;
  subindo = true;
  alturaMax = 0;
  hoverLiberado = false;
  hoverX = 0;
  hoverY = 0;
  hoverAtivo = false;
  linhaMax = null;
  maxAltitudeEl.textContent = "0";
  maxVelocityEl.textContent = "0";
  velocidadeAtual = 0;
  velocidadeMaxima = 0;
}

function desenharFoguete() {
  ctx.fillStyle = "white";
  ctx.fillRect(395, fogueteY, 10, 30);

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(390, fogueteY);
  ctx.lineTo(400, fogueteY - 20);
  ctx.lineTo(410, fogueteY);
  ctx.closePath();
  ctx.fill();

  // Aletas
  ctx.fillStyle = "#ff3b3b";
  ctx.beginPath();
  ctx.moveTo(395, fogueteY + 30);
  ctx.lineTo(385, fogueteY + 45);
  ctx.lineTo(395, fogueteY + 20);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(405, fogueteY + 30);
  ctx.lineTo(415, fogueteY + 45);
  ctx.lineTo(405, fogueteY + 20);
  ctx.closePath();
  ctx.fill();
}

function desenharParaquedas() {
  ctx.fillStyle = "gray";
  ctx.beginPath();
  ctx.arc(400, fogueteY - 15, 15, 0, Math.PI, true);
  ctx.fill();
}

function desenharHover() {
  ctx.fillStyle = "#0f0";
  ctx.fillRect(hoverX, hoverY, 20, 10);
  hoverX += 1.5;
}

function desenharLinhaAlturaMax() {
  if (linhaMax !== null) {
    ctx.strokeStyle = "#0f0";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, linhaMax);
    ctx.lineTo(canvas.width, linhaMax);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function desenharLinhaFoguete() {
  if (emVoo) {
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.moveTo(0, fogueteY + 15);
    ctx.lineTo(canvas.width, fogueteY + 15);
    ctx.stroke();
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (emVoo) {
    if (subindo) {
      fogueteY -= velocidadeAtual;
      velocidadeAtual -= gravidade * 0.05;
      
      // Atualiza a velocidade máxima
      if (velocidadeAtual > velocidadeMaxima) {
        velocidadeMaxima = velocidadeAtual;
        maxVelocityEl.textContent = velocidadeMaxima.toFixed(2);
      }

      if (velocidadeAtual <= 0) {
        subindo = false;
        linhaMax = fogueteY;
        maxAltitudeEl.textContent = Math.round((500 - fogueteY) * 0.5);
      }
    } else {
      fogueteY += gravidade * 0.5;

      if (fogueteY >= 480 && !hoverLiberado) {
        hoverLiberado = true;
        hoverAtivo = true;
        hoverX = 410;
        hoverY = fogueteY + 30;
      }

      if (fogueteY > 500) {
        emVoo = false;
        btn.textContent = "Acionar Foguete";
      }
    }
  }

  desenharFoguete();

  if (!subindo && emVoo) desenharParaquedas();
  if (hoverAtivo) desenharHover();
  if (linhaMax !== null) desenharLinhaAlturaMax();
  desenharLinhaFoguete();

  requestAnimationFrame(loop);
}

btn.addEventListener("click", () => {
  if (emVoo) {
    resetarSimulacao();
    btn.textContent = "Acionar Foguete";
    return;
  }

  const pesoFoguete = parseFloat(document.getElementById("pesoFoguete").value);
  const pesoHover = parseFloat(document.getElementById("pesoHover").value);
  const forcaDisparo = parseFloat(psiRange.value);

  const massaTotal = pesoFoguete + pesoHover;
  velocidadeAtual = (forcaDisparo / massaTotal) * 0.8;
  velocidadeMaxima = 0;
  maxVelocityEl.textContent = "0";

  emVoo = true;
  subindo = true;
  btn.textContent = "Parar Simulação";
});

// Inicia o loop do foguete
loop();