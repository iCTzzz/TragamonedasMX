const symbols = ["🍉","🍍","⭐","🍒","🍌","🌵","🎁"];
let credits = 100;

// Casillas del perímetro (24 posiciones)
const perimeterIndices = [
  0,1,2,3,4,5,
  11,17,
  23,22,21,20,19,18,
  12,6
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
const counters = {}; // guardamos apuestas
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
    if (counters[sym] < 9 && counters[sym] < credits) { // max 9 o créditos disponibles
      counters[sym]++;
      counterDiv.textContent = counters[sym];
    }
  });

  symbolsDiv.appendChild(btn);
});

const creditsEl = document.getElementById("credits");
const winEl = document.getElementById("win");
const spinBtn = document.getElementById("spinBtn");

spinBtn.addEventListener("click", () => {
  // Calcular total de apuesta
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

  // Animar luz alrededor del perímetro
  let i = 0;
  let steps = Math.floor(Math.random() * 50) + 30;
  const interval = setInterval(() => {
    cells.forEach(c => c.classList.remove("active"));
    const idx = perimeterIndices[i % perimeterIndices.length];
    cells[idx].classList.add("active");
    i++;
    if (i > steps) {
      clearInterval(interval);
      const finalIdx = perimeterIndices[(i-1) % perimeterIndices.length];
      const finalSymbol = cells[finalIdx].textContent;

      let win = counters[finalSymbol] * 5; // multiplicador
      credits += win;
      creditsEl.textContent = credits;
      winEl.textContent = win;

      // Reiniciar contadores a 0 después del giro
      for (let sym in counters) {
        counters[sym] = 0;
        document.querySelectorAll(".symbol-counter").forEach((div,idx)=>{
          div.textContent = counters[symbols[idx]];
        });
      }
    }
  }, 100);
});