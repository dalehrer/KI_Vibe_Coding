// Hilfsfunktionen für die Darstellung von Zahlen und Datumsangaben

// 1234.5 -> "1.234,50 €"
export function formatEuro(zahl) {
  return zahl.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

// Betrag für die Tabelle mit Vorzeichen, ohne Währung: -420 -> "−420,00", 534 -> "+534,00"
export function formatBetrag(zahl) {
  const text = Math.abs(zahl).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (zahl < 0 ? "−" : "+") + text;
}

// Erwartet Millisekunden (wie sie das Kontostand-Diagramm liefert)
export function formatDatum(ms) {
  return new Date(ms).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

// Date-Objekt -> "28.03.2024"
export function formatDatumKurz(datum) {
  return datum.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatMonat(datum) {
  return datum.toLocaleDateString("de-DE", { month: "short", year: "numeric" });
}

// Auf zwei Nachkommastellen runden (für Diagramm-Werte)
export function runde(zahl) {
  return Math.round(zahl * 100) / 100;
}
