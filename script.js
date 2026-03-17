const symbols = ["🍉","🍍","⭐","🍒","🍌","🌵","🎁"];
let credits = 100;

// Casillas del perímetro (24 posiciones) de un tablero 6x6
const perimeterIndices = [
  0,1,2,3,4,5,       // fila superior
  11,17,             // columnas derecha
  23,22,21,20,19,18, // fila inferior
  12,6               // columna izquierda
];

// Generar tablero
const board = document.getElementById("board");
const cells = [];
for (let i = 0; i < 36; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  if (perimeterIndices.includes(i)) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    cell.textContent = symbol;
  }

  board.appendChild(cell);
  cells.push(cell);
}

// Generar botones de símbolos con contador
const symbolsDiv = document.getElementById("symbols");
const counters = {};
symbols.forEach(sym => {
  counters[sym] = 0;

  const btn = document.createElement("button");
  btn.classList.add("symbol-btn");

  const symDiv = document.createElement("div");
  symDiv.textContent = sym;

  const counterDiv = document.createElement("div");
  counterDiv.classList.add("symbol-counter");
  counterDiv.textContent = "0";

  btn.appendChild(symDiv);
  btn.appendChild(counterDiv);

  btn.addEventListener("click", () => {
    if (counters[sym] < 9 && counters[sym] < credits) {
      counters[sym]++;
      counterDiv.textContent = counters[sym];
    }
  });

  symbolsDiv.appendChild(btn);
});

const creditsEl = document.getElementById("credits");
const winEl = document.getElementById("win");
const spinBtn = document.getElementById("spinBtn");
const spinSound = document.getElementById("spinSound");

spinBtn.addEventListener("click", () => {
  let totalBet = Object.values(counters).reduce((a,b)=>a+b,0);
  if (totalBet === 0) {
    alert("Debes apostar al menos 1 crédito en algún símbolo");
    return;
  }
  if (totalBet > credits) {
    alert("No tienes suficientes créditos");
    return;
  }

  credits -= totalBet;
  creditsEl.textContent = credits;

  // Reproducir sonido
  spinSound.currentTime = 0;
  spinSound.play();

  let pos = 0;

  // Función que mueve la luz
  const updateLight = () => {
    cells.forEach(c => c.classList.remove("active"));
    const idx = perimeterIndices[pos % perimeterIndices.length];
    cells[idx].classList.add("active");
    pos++;
  };

  // Intervalo sincronizado con el ritmo del sonido
  // Ajusta intervalMs para que coincida con el beat real del audio
  const intervalMs = 150;
  let animationInterval = setInterval(updateLight, intervalMs);

  // Cuando el audio termine, se detiene la luz
  spinSound.onended = () => {
    clearInterval(animationInterval);

    const finalIdx = perimeterIndices[(pos-1) % perimeterIndices.length];
    const finalSymbol = cells[finalIdx].textContent;

    let win = counters[finalSymbol] * 5; // multiplicador
    credits += win;
    creditsEl.textContent = credits;
    winEl.textContent = win;

    // Reiniciar contadores
    for (let sym in counters) {
      counters[sym] = 0;
      document.querySelectorAll(".symbol-counter").forEach((div,idx)=>{
        div.textContent = counters[symbols[idx]];
      });
    }
  };
});
