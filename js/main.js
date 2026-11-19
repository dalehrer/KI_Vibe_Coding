// Einstiegspunkt: Daten laden, Bedienelemente verdrahten, Ansicht aktualisieren

import { ladeDaten } from "./daten.js";
import { befuelleKategorien, findeTreffer, setzeFilterZurueck } from "./filter.js";
import { baueKopf, aktualisierePfeile, zeigeZeilen } from "./tabelle.js";
import { berechneStatistik } from "./statistik.js";
import { zeigeZusammenfassung } from "./zusammenfassung.js";
import { zeigeKarten } from "./karten.js";
import { zeigeKontostand } from "./kontostand.js";
import { baueDiagramme, aktualisiereDiagramme, faerbeDiagrammeNeu } from "./diagramme.js";
import { starteThema } from "./thema.js";

// Design (hell/dunkel) sofort setzen, noch bevor die Daten geladen sind
starteThema(faerbeDiagrammeNeu);

// Alles neu zeichnen, was von Filter und Sortierung abhängt
function aktualisieren() {
  const treffer = findeTreffer();
  const stat = berechneStatistik(treffer);

  zeigeZeilen(treffer);
  aktualisierePfeile();
  zeigeZusammenfassung(treffer.length, stat);
  zeigeKarten(stat);
  aktualisiereDiagramme(stat);
}

// Bei jeder Änderung an den Bedienelementen neu zeichnen
function verdrahteBedienelemente() {
  ["filter-art", "filter-kategorie"].forEach((id) => {
    document.getElementById(id).addEventListener("change", aktualisieren);
  });
  document.getElementById("filter-suche").addEventListener("input", aktualisieren);

  document.getElementById("zuruecksetzen").addEventListener("click", () => {
    setzeFilterZurueck();
    aktualisieren();
  });
}

async function start() {
  try {
    // Die CSV-Datei muss im selben Ordner wie index.html liegen
    await ladeDaten("datensatz.csv");
  } catch (fehler) {
    document.getElementById("status").textContent = "Fehler: " + fehler.message;
    return;
  }

  zeigeKontostand(); // hängt nicht von den Filtern ab, einmal reicht
  setzeFilterZurueck(); // Startsortierung: Datum aufsteigend
  baueKopf(aktualisieren);
  befuelleKategorien();
  baueDiagramme();
  verdrahteBedienelemente();
  aktualisieren();
}

start();
