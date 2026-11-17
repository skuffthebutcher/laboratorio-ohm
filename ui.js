function buildSelectOptionsAndTable() {
  const s1 = document.getElementById("sel-b1");
  const s2 = document.getElementById("sel-b2");
  const s3 = document.getElementById("sel-b3");
  const sMult = document.getElementById("sel-mult");
  const sTol = document.getElementById("sel-tol");
  const tbody = document.getElementById("color-table-body");

  COLOR_DATA.forEach((c, idx) => {
    if (c.digit !== null) {
      if (c.digit !== 0) {
        s1.add(new Option(`${c.name} (${c.digit})`, idx));
      }
      s2.add(new Option(`${c.name} (${c.digit})`, idx));
      s3.add(new Option(`${c.name} (${c.digit})`, idx));
    }
    if (c.mult !== null) {
      sMult.add(new Option(`${c.name} (×${formatShort(c.mult)})`, idx));
    }
    if (c.tol !== null) {
      sTol.add(new Option(`${c.name} (±${c.tol}%)`, idx));
    }

    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.className = "color-swatch-cell";
    tdName.innerHTML = `<span class="swatch-dot" style="background:${c.hex}"></span>${c.name}`;
    tr.appendChild(tdName);

    tr.appendChild(createTableCell(
      c.digit !== null && c.digit !== 0 ? c.digit : "—",
      c.digit !== null && c.digit !== 0,
      () => applyBandFromTable("sel-b1", idx)
    ));

    tr.appendChild(createTableCell(
      c.digit !== null ? c.digit : "—",
      c.digit !== null,
      () => applyBandFromTable("sel-b2", idx)
    ));

    const td3 = createTableCell(
      c.digit !== null ? c.digit : "—",
      c.digit !== null,
      () => applyBandFromTable("sel-b3", idx)
    );
    td3.classList.add("col-b3");
    td3.style.display = "none";
    tr.appendChild(td3);

    tr.appendChild(createTableCell(
      c.mult !== null ? `×${formatShort(c.mult)}` : "—",
      c.mult !== null,
      () => applyBandFromTable("sel-mult", idx)
    ));

    tr.appendChild(createTableCell(
      c.tol !== null ? `±${c.tol}%` : "—",
      c.tol !== null,
      () => applyBandFromTable("sel-tol", idx)
    ));

    tbody.appendChild(tr);
  });

  // Valore iniziale: 1 kOhm ±5% (Marrone, Nero, Rosso, Oro)
  s1.value = 1;
  s2.value = 0;
  s3.value = 0;
  sMult.value = 2;
  sTol.value = 10;
}

function createTableCell(text, isClickable, onClickFn) {
  const td = document.createElement("td");
  td.textContent = text;
  if (isClickable) {
    td.className = "clickable-cell";
    td.title = "Clicca per applicare questa banda";
    td.onclick = onClickFn;
  } else {
    td.className = "disabled-cell";
  }
  return td;
}

function applyBandFromTable(selectId, colorIdx) {
  document.getElementById(selectId).value = colorIdx;
  document.getElementById("rev-feedback").textContent = "Banda aggiornata dalla tabella di riferimento.";
  updateApp();
}

function renderResistorAndDisplay(calcResult) {
  const { totalOhms, tolerance, minOhms, maxOhms, colors } = calcResult;

  document.getElementById("vis-b1").style.backgroundColor = colors.c1.hex;
  document.getElementById("vis-b2").style.backgroundColor = colors.c2.hex;
  document.getElementById("vis-b3").style.backgroundColor = colors.c3.hex;
  document.getElementById("vis-mult").style.backgroundColor = colors.cMult.hex;
  document.getElementById("vis-tol").style.backgroundColor = colors.cTol.hex;

  document.getElementById("output-val").textContent = `${formatOhms(totalOhms)} ±${tolerance}%`;
  document.getElementById("output-range").textContent = `Tolleranza ammessa: ${formatOhms(minOhms)} — ${formatOhms(maxOhms)}`;
}

function toggleBandModeUI(count) {
  document.getElementById("btn-4band").classList.toggle("active", count === 4);
  document.getElementById("btn-5band").classList.toggle("active", count === 5);

  const is5 = count === 5;
  document.getElementById("group-b3").style.display = is5 ? "flex" : "none";
  document.getElementById("vis-b3").style.display = is5 ? "block" : "none";
  document.getElementById("th-b3").style.display = is5 ? "table-cell" : "none";

  document.querySelectorAll(".col-b3").forEach(cell => {
    cell.style.display = is5 ? "table-cell" : "none";
  });
}
