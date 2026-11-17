const COLOR_DATA = [
  { name: "Nero",     hex: "#1c1917", digit: 0,    mult: 1,          tol: null },
  { name: "Marrone",  hex: "#6b3e26", digit: 1,    mult: 10,         tol: 1 },
  { name: "Rosso",    hex: "#b93829", digit: 2,    mult: 100,        tol: 2 },
  { name: "Arancio",  hex: "#d96b27", digit: 3,    mult: 1000,       tol: null },
  { name: "Giallo",   hex: "#e3b434", digit: 4,    mult: 10000,      tol: null },
  { name: "Verde",    hex: "#3a6b48", digit: 5,    mult: 100000,     tol: 0.5 },
  { name: "Blu",      hex: "#2c5d87", digit: 6,    mult: 1000000,    tol: 0.25 },
  { name: "Viola",    hex: "#6c4675", digit: 7,    mult: 10000000,   tol: 0.1 },
  { name: "Grigio",   hex: "#73706b", digit: 8,    mult: 100000000,  tol: 0.05 },
  { name: "Bianco",   hex: "#f5f2eb", digit: 9,    mult: 1000000000, tol: null },
  { name: "Oro",      hex: "#c99e42", digit: null, mult: 0.1,        tol: 5 },
  { name: "Argento",  hex: "#a8a7a2", digit: null, mult: 0.01,       tol: 10 }
];

const E12_SERIES = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

const E24_SERIES = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
];
