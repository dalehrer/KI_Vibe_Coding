// Diagramme mit Chart.js (die Bibliothek wird in index.html aus js/lib geladen)

import { daten } from "./daten.js";
import { STARTKONTOSTAND, GRUPPEN_FARBEN } from "./config.js";
import { formatEuro, formatDatum, formatMonat, runde } from "./format.js";
import { nachSummeSortiert } from "./statistik.js";
import { wendeFarbenAn } from "./diagramm-stil.js";

const diagramme = {};

// Gemeinsamer Stil der Info-Kästchen beim Darüberfahren mit der Maus
const tooltipStil = { padding: 10, cornerRadius: 8, boxPadding: 4 };

// Diagramme einmalig anlegen (Daten kommen später in aktualisiereDiagramme)
export function baueDiagramme() {
  if (typeof Chart === "undefined") {
    document.getElementById("diagramm-hinweis").textContent =
      "Die Diagramme konnten nicht geladen werden.";
    document.getElementById("diagramme").style.display = "none";
    return;
  }

  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;

  baueKontostand();
  baueDonut();
  baueMonate();
  wendeFarbenAn(diagramme);
}

// Nach dem Umschalten hell/dunkel aufrufen
export function faerbeDiagrammeNeu() {
  if (diagramme.kontostand) wendeFarbenAn(diagramme);
}

// Kontostand: immer über alle Buchungen, chronologisch
function baueKontostand() {
  const alle = daten.buchungen.slice().sort((a, b) => a.datum - b.datum);
  let saldo = STARTKONTOSTAND;
  const punkte = alle.map((b) => {
    saldo += b.betrag;
    return { x: b.datum.getTime(), y: runde(saldo) };
  });

  diagramme.kontostand = new Chart(document.getElementById("chart-kontostand"), {
    type: "line",
    data: {
      datasets: [{ label: "Kontostand", data: punkte, stepped: "after", fill: true,
        borderWidth: 2, pointRadius: 0, pointHoverRadius: 5 }]
    },
    options: {
      maintainAspectRatio: false,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      scales: {
        x: {
          type: "linear",
          min: punkte[0].x,
          max: punkte[punkte.length - 1].x,
          grid: { display: false },
          ticks: { callback: (wert) => formatDatum(wert), maxTicksLimit: 7 }
        },
        y: { ticks: { callback: (wert) => wert + " €" } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStil, callbacks: {
          title: (eintraege) => formatDatum(eintraege[0].parsed.x),
          label: (eintrag) => " " + formatEuro(eintrag.parsed.y)
        } }
      }
    }
  });
}

function baueDonut() {
  diagramme.gruppen = new Chart(document.getElementById("chart-kategorien"), {
    type: "doughnut",
    data: { labels: [], datasets: [{ data: [], borderWidth: 3, hoverOffset: 6 }] },
    options: {
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: { position: "right", labels: { usePointStyle: true, pointStyle: "circle", padding: 14 } },
        tooltip: { ...tooltipStil, callbacks: { label: (eintrag) => " " + eintrag.label + ": " + formatEuro(eintrag.parsed) } }
      }
    }
  });
}

function baueMonate() {
  const balken = { borderRadius: 6, maxBarThickness: 28 };
  diagramme.monate = new Chart(document.getElementById("chart-monate"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        { label: "Einnahmen", data: [], ...balken },
        { label: "Ausgaben", data: [], ...balken }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { callback: (wert) => wert + " €" } }
      },
      plugins: {
        legend: { labels: { usePointStyle: true, pointStyle: "rectRounded" } },
        tooltip: { ...tooltipStil, callbacks: { label: (eintrag) => " " + eintrag.dataset.label + ": " + formatEuro(eintrag.parsed.y) } }
      }
    }
  });
}

// Donut und Balkendiagramm an die gefilterten Daten anpassen
export function aktualisiereDiagramme(stat) {
  if (!diagramme.gruppen) return;

  // Donut: nur die groben Gruppen, größte zuerst
  const gruppen = nachSummeSortiert(stat.proGruppe);
  diagramme.gruppen.data.labels = gruppen;
  diagramme.gruppen.data.datasets[0].data = gruppen.map((g) => runde(stat.proGruppe[g]));
  diagramme.gruppen.data.datasets[0].backgroundColor = gruppen.map((g) => GRUPPEN_FARBEN[g]);
  diagramme.gruppen.update();

  // Balken: ein Paar je Monat, chronologisch
  const monate = Object.keys(stat.proMonat).sort();
  diagramme.monate.data.labels = monate.map((m) => formatMonat(stat.proMonat[m].datum));
  diagramme.monate.data.datasets[0].data = monate.map((m) => runde(stat.proMonat[m].einnahmen));
  diagramme.monate.data.datasets[1].data = monate.map((m) => runde(stat.proMonat[m].ausgaben));
  diagramme.monate.update();
}
