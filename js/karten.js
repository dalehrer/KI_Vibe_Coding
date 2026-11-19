// Kennzahlen-Karten über den Diagrammen

import { daten, anzahlMonate } from "./daten.js";
import { formatEuro } from "./format.js";
import { nachSummeSortiert } from "./statistik.js";

// Jede Karte: [Titel, Wert, Zusatztext]
function berechneKarten(stat) {
  const karten = [];

  karten.push(["Ø Ausgaben pro Monat", formatEuro(-stat.ausgaben / anzahlMonate()), "verteilt auf " + anzahlMonate() + " Monate"]);

  if (stat.groessteAusgabe) {
    karten.push([
      "Größte Einzelausgabe",
      formatEuro(-stat.groessteAusgabe.betrag),
      stat.groessteAusgabe.felder[daten.spalten.beschreibung]
    ]);
  } else {
    karten.push(["Größte Einzelausgabe", "–", ""]);
  }

  const kategorien = nachSummeSortiert(stat.proKategorie);
  if (kategorien.length > 0) {
    karten.push(["Teuerste Kategorie", kategorien[0], formatEuro(stat.proKategorie[kategorien[0]]) + " insgesamt"]);
  } else {
    karten.push(["Teuerste Kategorie", "–", ""]);
  }

  if (stat.einnahmen > 0) {
    const quote = (stat.einnahmen + stat.ausgaben) / stat.einnahmen * 100;
    karten.push(["Sparquote", quote.toFixed(1).replace(".", ",") + " %", "Anteil der Einnahmen, der übrig bleibt"]);
  } else {
    karten.push(["Sparquote", "–", ""]);
  }

  return karten;
}

export function zeigeKarten(stat) {
  const box = document.getElementById("karten");
  box.innerHTML = "";

  berechneKarten(stat).forEach(([titel, wert, zusatz]) => {
    const karte = document.createElement("div");
    karte.className = "karte flaeche";
    karte.title = zusatz; // langer Zusatztext wird abgeschnitten, beim Darüberfahren komplett sichtbar

    [["karte-titel", titel], ["karte-wert", wert], ["karte-zusatz", zusatz]].forEach(([klasse, text]) => {
      const zeile = document.createElement("div");
      zeile.className = klasse;
      zeile.textContent = text;
      karte.appendChild(zeile);
    });

    box.appendChild(karte);
  });
}
