// Kontostand-Anzeige im Kopfbereich (immer alle Buchungen, unabhängig von den Filtern)

import { daten } from "./daten.js";
import { STARTKONTOSTAND } from "./config.js";
import { formatEuro, formatDatumKurz } from "./format.js";

export function zeigeKontostand() {
  // Chronologisch durchgehen und dabei tiefsten und höchsten Stand merken
  const alle = daten.buchungen.slice().sort((a, b) => a.datum - b.datum);
  let stand = STARTKONTOSTAND;
  let tief = { wert: stand, datum: null };
  let hoch = { wert: stand, datum: null };

  alle.forEach((b) => {
    stand += b.betrag;
    if (stand < tief.wert) tief = { wert: stand, datum: b.datum };
    if (stand > hoch.wert) hoch = { wert: stand, datum: b.datum };
  });

  const letztesDatum = alle[alle.length - 1].datum;
  const veraenderung = stand - STARTKONTOSTAND;

  document.getElementById("kontostand-wert").textContent = formatEuro(stand);
  document.getElementById("kontostand-zusatz").textContent =
    "Stand " + formatDatumKurz(letztesDatum) + " · " +
    (veraenderung >= 0 ? "+" : "") + formatEuro(veraenderung) + " seit Start (" + formatEuro(STARTKONTOSTAND) + ")";

  // Rechts daneben: Tiefst- und Höchststand
  const details = document.getElementById("kontostand-details");
  details.innerHTML = "";
  [["Tiefststand", tief], ["Höchststand", hoch]].forEach(([titel, eintrag]) => {
    const box = document.createElement("div");
    box.innerHTML = '<div class="detail-titel"></div><div class="detail-wert"></div>';
    box.children[0].textContent = titel + (eintrag.datum ? " · " + formatDatumKurz(eintrag.datum) : "");
    box.children[1].textContent = formatEuro(eintrag.wert);
    details.appendChild(box);
  });
}
