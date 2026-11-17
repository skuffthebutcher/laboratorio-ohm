function formatShort(num) {
  if (num >= 1e9) return (num / 1e9) + "G";
  if (num >= 1e6) return (num / 1e6) + "M";
  if (num >= 1e3) return (num / 1e3) + "k";
  return num.toString();
}

function formatOhms(ohms) {
  if (ohms >= 1e9) return parseFloat((ohms / 1e9).toFixed(3)) + " GΩ";
  if (ohms >= 1e6) return parseFloat((ohms / 1e6).toFixed(3)) + " MΩ";
  if (ohms >= 1e3) return parseFloat((ohms / 1e3).toFixed(3)) + " kΩ";
  return parseFloat(ohms.toFixed(3)) + " Ω";
}

function calculateDirectValues(bandsCount, idx1, idx2, idx3, idxMult, idxTol) {
  const c1 = COLOR_DATA.at(idx1);
  const c2 = COLOR_DATA.at(idx2);
  const c3 = COLOR_DATA.at(idx3);
  const cMult = COLOR_DATA.at(idxMult);
  const cTol = COLOR_DATA.at(idxTol);

  const baseValue = bandsCount === 4
    ? (c1.digit * 10) + c2.digit
    : (c1.digit * 100) + (c2.digit * 10) + c3.digit;

  const totalOhms = baseValue * cMult.mult;
  const tolerance = cTol.tol;

  return {
    totalOhms: totalOhms,
    tolerance: tolerance,
    minOhms: totalOhms * (1 - tolerance / 100),
    maxOhms: totalOhms * (1 + tolerance / 100),
    colors: { c1, c2, c3, cMult, cTol }
  };
}

function snapToStandardSeries(ohms, seriesArray) {
  const decade = Math.floor(Math.log10(ohms));
  const scale = Math.pow(10, decade);
  const normalized = ohms / scale;

  let closest = seriesArray.at(0);
  let minDiff = Math.abs(normalized - closest);

  const candidates = seriesArray.concat([10.0]);
  for (let i = 0; i < candidates.length; i++) {
    const val = candidates.at(i);
    const diff = Math.abs(normalized - val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = val;
    }
  }

  return closest * scale;
}

function solveReverseBands(rawVal, unitMult, seriesMode, bandsCount) {
  if (isNaN(rawVal) || rawVal <= 0) {
    return { error: "ATTENZIONE: Inserire un valore numerico maggiore di zero." };
  }

  let targetOhms = rawVal * unitMult;
  const minVal = bandsCount === 4 ? 0.1 : 1;
  const maxVal = bandsCount === 4 ? 99e9 : 999e9;

  if (targetOhms < minVal || targetOhms > maxVal) {
    return { error: `FUORI SCALA: Valore non rappresentabile su ${bandsCount} bande.` };
  }

  let snappedNote = "";
  let forcedTolIdx = null;

  if (seriesMode === "E12") {
    targetOhms = snapToStandardSeries(targetOhms, E12_SERIES);
    forcedTolIdx = 11; // Argento ±10%
    snappedNote = ` [Adattato a standard E12: ${formatOhms(targetOhms)}]`;
  } else if (seriesMode === "E24") {
    targetOhms = snapToStandardSeries(targetOhms, E24_SERIES);
    forcedTolIdx = 10; // Oro ±5%
    snappedNote = ` [Adattato a standard E24: ${formatOhms(targetOhms)}]`;
  }

  const sigDigits = bandsCount === 4 ? 2 : 3;
  const exponent = Math.floor(Math.log10(targetOhms)) - (sigDigits - 1);
  let multiplier = Math.pow(10, exponent);
  let baseDigits = Math.round(targetOhms / multiplier);

  const limit = bandsCount === 4 ? 100 : 1000;
  if (baseDigits >= limit) {
    baseDigits = Math.round(baseDigits / 10);
    multiplier *= 10;
  }

  if (multiplier < 0.01) {
    multiplier = 0.01;
    baseDigits = Math.round(targetOhms / multiplier);
  }

  const digitsStr = baseDigits.toString().padStart(sigDigits, "0");
  const d1 = parseInt(digitsStr.charAt(0), 10);
  const d2 = parseInt(digitsStr.charAt(1), 10);
  const d3 = bandsCount === 5 ? parseInt(digitsStr.charAt(2), 10) : 0;

  let multIdx = COLOR_DATA.findIndex(c => c.mult !== null && Math.abs(c.mult - multiplier) < 1e-6);
  if (multIdx === -1) multIdx = 0;

  const actualOhms = baseDigits * COLOR_DATA.at(multIdx).mult;
  let message = "";

  if (seriesMode !== "exact") {
    message = `COMBINAZIONE GENERATA.${snappedNote}`;
  } else if (Math.abs(actualOhms - (rawVal * unitMult)) > 1e-5) {
    message = `APPROSSIMAZIONE: Valore più vicino rappresentabile ${formatOhms(actualOhms)}.`;
  } else {
    message = "CORRISPONDENZA ESATTA RILEVATA.";
  }

  return {
    d1,
    d2,
    d3,
    multIdx,
    forcedTolIdx,
    message
  };
}
