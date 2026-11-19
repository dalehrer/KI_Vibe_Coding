// Statuszeile und Zusammenfassung (Einnahmen / Ausgaben / Saldo als "Pillen")

import { daten } from "./daten.js";
import { formatEuro } from "./format.js";

export function zeigeZusammenfassung(anzahlTreffer, stat) {
  document.getElementById("status").textContent =
    anzahlTreffer + " von " + daten.buchungen.length + " Transaktionen angezeigt";

  const saldo = stat.einnahmen + stat.ausgaben;
  const pillen = [
    ["Einnahmen", stat.einnahmen, "positiv"],
    ["Ausgaben", stat.ausgaben, "negativ"],
    ["Saldo", saldo, saldo >= 0 ? "positiv" : "negativ"]
  ];

  const box = document.getElementById("zusammenfassung");
  box.innerHTML = "";
  pillen.forEach(([titel, wert, klasse]) => {
    const pille = document.createElement("span");
    pille.className = "pille " + klasse;
    pille.textContent = titel;
    const zahl = document.createElement("b");
    zahl.textContent = formatEuro(wert);
    pille.appendChild(zahl);
    box.appendChild(pille);
  });
}
