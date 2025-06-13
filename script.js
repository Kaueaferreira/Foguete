const canvas = document.getElementById("canvasFoguete");
const ctx = canvas.getContext("2d");

const btn = document.getElementById("btnDisparo");
const maxAltitudeEl = document.getElementById("maxAltitude");

let fogueteY = 500;
let velocidade = 0;
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
      fogueteY -= velocidade;
      velocidade -= gravidade * 0.05;

      if (velocidade <= 0) {
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
  const forcaDisparo = parseFloat(document.getElementById("forcaDisparo").value);

  const massaTotal = pesoFoguete + pesoHover;
  velocidade = (forcaDisparo / massaTotal) * 0.8;

  emVoo = true;
  subindo = true;
  btn.textContent = "Parar Simulação";
});

loop();
