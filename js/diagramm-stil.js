// Farben der Diagramme passend zum aktuellen Design (hell/dunkel).
// Die Farben kommen aus den CSS-Variablen in css/basis.css.

function cssFarbe(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// "#0f7a5a" + Deckkraft 0.3 -> "rgba(15, 122, 90, 0.3)"
function mitDeckkraft(hex, deckkraft) {
  const zahl = parseInt(hex.slice(1), 16);
  return "rgba(" + (zahl >> 16) + ", " + ((zahl >> 8) & 255) + ", " + (zahl & 255) + ", " + deckkraft + ")";
}

// Farbverlauf unter der Kontostand-Linie (oben kräftig, unten durchsichtig)
function verlauf(kontext) {
  const { ctx, chartArea } = kontext.chart;
  if (!chartArea) return null; // beim allerersten Zeichnen noch unbekannt
  const primaer = cssFarbe("--primaer");
  const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  g.addColorStop(0, mitDeckkraft(primaer, 0.35));
  g.addColorStop(1, mitDeckkraft(primaer, 0));
  return g;
}

// Achsen (Beschriftung und Rasterlinien) einfärben
function faerbeAchsen(chart, text, raster) {
  Object.values(chart.options.scales || {}).forEach((achse) => {
    achse.ticks.color = text;
    achse.grid.color = raster;
    achse.border = { display: false };
  });
}

// Alle Diagramme neu einfärben und neu zeichnen
export function wendeFarbenAn(diagramme) {
  const text = cssFarbe("--text-leise");
  const raster = cssFarbe("--rand");

  Chart.defaults.color = text;

  Object.values(diagramme).forEach((chart) => {
    faerbeAchsen(chart, text, raster);
    chart.options.plugins.legend.labels.color = text;
  });

  const linie = diagramme.kontostand.data.datasets[0];
  linie.borderColor = cssFarbe("--primaer");
  linie.backgroundColor = verlauf;

  // Ränder der Donut-Stücke in Hintergrundfarbe, damit sie getrennt wirken
  diagramme.gruppen.data.datasets[0].borderColor = cssFarbe("--flaeche");

  diagramme.monate.data.datasets[0].backgroundColor = cssFarbe("--einnahme");
  diagramme.monate.data.datasets[1].backgroundColor = cssFarbe("--ausgabe");

  Object.values(diagramme).forEach((chart) => chart.update());
}
