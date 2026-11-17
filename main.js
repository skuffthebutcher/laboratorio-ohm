let currentBands = 4;

function updateApp() {
  const idx1 = parseInt(document.getElementById("sel-b1").value, 10);
  const idx2 = parseInt(document.getElementById("sel-b2").value, 10);
  const idx3 = parseInt(document.getElementById("sel-b3").value, 10);
  const idxMult = parseInt(document.getElementById("sel-mult").value, 10);
  const idxTol = parseInt(document.getElementById("sel-tol").value, 10);

  const result = calculateDirectValues(currentBands, idx1, idx2, idx3, idxMult, idxTol);
  renderResistorAndDisplay(result);
}

function setBands(count) {
  currentBands = count;
  toggleBandModeUI(count);

  if (document.getElementById("rev-input").value !== "") {
    handleReverseSearch();
  } else {
    updateApp();
  }
}

function handleReverseSearch() {
  const rawVal = parseFloat(document.getElementById("rev-input").value);
  const unitMult = parseFloat(document.getElementById("rev-unit").value);
  const seriesMode = document.getElementById("rev-series").value;
  const feedback = document.getElementById("rev-feedback");

  const solution = solveReverseBands(rawVal, unitMult, seriesMode, currentBands);

  if (solution.error) {
    feedback.textContent = solution.error;
    return;
  }

  document.getElementById("sel-b1").value = solution.d1;
  document.getElementById("sel-b2").value = solution.d2;
  if (currentBands === 5) {
    document.getElementById("sel-b3").value = solution.d3;
  }
  document.getElementById("sel-mult").value = solution.multIdx;

  if (solution.forcedTolIdx !== null) {
    document.getElementById("sel-tol").value = solution.forcedTolIdx;
  }

  feedback.textContent = solution.message;
  updateApp();
}

document.addEventListener("DOMContentLoaded", () => {
  buildSelectOptionsAndTable();
  updateApp();

  document.getElementById("rev-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleReverseSearch();
    }
  });
});

// Registrazione Service Worker per funzionamento offline (PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => console.log("Service Worker registrato: App pronta per uso offline."))
      .catch((err) => console.error("Errore registrazione Service Worker:", err));
  });
}
