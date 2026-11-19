// Filter-Leiste: Auswahl lesen, Treffer filtern und sortieren

import { daten } from "./daten.js";

// Aktuelle Sortierung: Spaltennummer und Richtung (1 = aufsteigend, -1 = absteigend)
export const sortierung = { spalte: 0, richtung: 1 };

// Kategorien automatisch aus den Daten sammeln
export function befuelleKategorien() {
  const kategorien = new Set(daten.buchungen.map((b) => b.felder[daten.spalten.kategorie]));
  const sortiert = [...kategorien].sort((a, b) => a.localeCompare(b, "de"));

  const auswahl = document.getElementById("filter-kategorie");
  sortiert.forEach((k) => {
    const option = document.createElement("option");
    option.value = k;
    option.textContent = k;
    auswahl.appendChild(option);
  });
}

// Filter anwenden und das Ergebnis nach der aktuellen Sortierung liefern
export function findeTreffer() {
  const s = daten.spalten;
  const art = document.getElementById("filter-art").value;
  const kategorie = document.getElementById("filter-kategorie").value;
  const suche = document.getElementById("filter-suche").value.trim().toLowerCase();

  const treffer = daten.buchungen.filter((b) => {
    if (art === "ausgaben" && b.betrag >= 0) return false;
    if (art === "einnahmen" && b.betrag < 0) return false;
    if (kategorie && b.felder[s.kategorie] !== kategorie) return false;
    if (suche && !b.felder[s.beschreibung].toLowerCase().includes(suche)) return false;
    return true;
  });

  treffer.sort((a, b) => {
    let ergebnis;
    if (sortierung.spalte === s.datum) {
      ergebnis = a.datum - b.datum;
    } else if (sortierung.spalte === s.betrag) {
      ergebnis = a.betrag - b.betrag;
    } else {
      ergebnis = a.felder[sortierung.spalte].localeCompare(b.felder[sortierung.spalte], "de");
    }
    return ergebnis * sortierung.richtung;
  });

  return treffer;
}

// Alle Filter und die Sortierung auf den Ausgangszustand setzen
export function setzeFilterZurueck() {
  document.getElementById("filter-art").value = "alle";
  document.getElementById("filter-kategorie").value = "";
  document.getElementById("filter-suche").value = "";
  sortierung.spalte = daten.spalten.datum;
  sortierung.richtung = 1;
}
