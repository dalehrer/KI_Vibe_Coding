// Tabelle: Kopfzeile mit Sortier-Pfeilen und Datenzeilen

import { daten } from "./daten.js";
import { sortierung } from "./filter.js";
import { gruppeFuer, GRUPPEN_FARBEN, EINNAHMEN_FARBE } from "./config.js";
import { formatBetrag } from "./format.js";

// Kopfzeile einmalig aufbauen. Bei einem Klick wird "beiSortierung" aufgerufen.
export function baueKopf(beiSortierung) {
  const kopfZeile = document.createElement("tr");

  daten.kopf.forEach((name, spalte) => {
    const th = document.createElement("th");
    th.className = "sortierbar";
    th.appendChild(document.createTextNode(name + " "));

    const pfeil = document.createElement("span");
    pfeil.className = "pfeil";
    th.appendChild(pfeil);

    // Klick auf die Überschrift: sortieren, nochmal klicken = Richtung umdrehen
    th.addEventListener("click", () => {
      if (sortierung.spalte === spalte) {
        sortierung.richtung = -sortierung.richtung;
      } else {
        sortierung.spalte = spalte;
        sortierung.richtung = 1;
      }
      beiSortierung();
    });
    kopfZeile.appendChild(th);
  });

  document.querySelector("#tabelle thead").appendChild(kopfZeile);
}

// Pfeile in den Überschriften an die aktuelle Sortierung anpassen
export function aktualisierePfeile() {
  document.querySelectorAll("#tabelle th .pfeil").forEach((pfeil, spalte) => {
    if (spalte === sortierung.spalte) {
      pfeil.textContent = sortierung.richtung === 1 ? "▲" : "▼";
    } else {
      pfeil.textContent = "↕";
    }
  });
}

// Eine Zelle füllen: Kategorie als farbiges Etikett, Betrag formatiert, Rest als Text
function fuelleZelle(td, wert, spalte, b) {
  const s = daten.spalten;
  if (spalte === s.kategorie) {
    const etikett = document.createElement("span");
    etikett.className = "etikett";
    etikett.textContent = wert;
    // Farbe des Punkts: Einnahmen grün, Ausgaben in der Farbe ihrer Gruppe
    const farbe = b.betrag >= 0 ? EINNAHMEN_FARBE : GRUPPEN_FARBEN[gruppeFuer(wert)];
    etikett.style.setProperty("--punkt", farbe);
    td.appendChild(etikett);
  } else if (spalte === s.betrag) {
    td.textContent = formatBetrag(b.betrag);
    td.className = "betrag " + (b.betrag >= 0 ? "positiv" : "negativ");
  } else {
    td.textContent = wert;
    if (spalte === s.beschreibung) td.className = "beschreibung";
    if (spalte === s.waehrung) td.className = "waehrung";
  }
}

// Tabellenzeilen neu aufbauen
export function zeigeZeilen(treffer) {
  const tbody = document.querySelector("#tabelle tbody");
  tbody.innerHTML = "";

  if (treffer.length === 0) {
    tbody.innerHTML = '<tr><td class="leer" colspan="' + daten.kopf.length + '">Keine passenden Buchungen gefunden.</td></tr>';
    return;
  }

  treffer.forEach((b) => {
    const tr = document.createElement("tr");
    b.felder.forEach((wert, spalte) => {
      const td = document.createElement("td");
      fuelleZelle(td, wert, spalte, b);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
