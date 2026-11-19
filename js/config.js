// Einstellungen und feste Zuordnungen

// Angenommener Kontostand vor der ersten Buchung
export const STARTKONTOSTAND = 500;

// Gröbere Gruppen für das Kreisdiagramm: Gruppe -> Kategorien aus der CSV
// (neue Kategorien, die hier fehlen, landen automatisch in "Sonstiges")
export const KATEGORIE_GRUPPEN = {
  "Wohnen & Fixkosten": ["Miete", "Nebenkosten", "Haushalt", "Mobilfunk", "Streaming", "Versicherung", "Rundfunkbeitrag"],
  "Essen & Trinken": ["Lebensmittel", "Mensa", "Gastronomie"],
  "Uni & Bildung": ["Semesterbeitrag", "Lernmaterial", "Prüfungsgebühr"],
  "Freizeit & Shopping": ["Freizeit", "Sport", "Kleidung", "Geschenke"],
  "Gesundheit & Mobilität": ["Drogerie", "Gesundheit", "Verkehr"]
};

// Farben je Gruppe (Donut-Diagramm und Punkte vor den Kategorien in der Tabelle)
export const GRUPPEN_FARBEN = {
  "Wohnen & Fixkosten": "#6366f1",
  "Essen & Trinken": "#f59e0b",
  "Uni & Bildung": "#0ea5e9",
  "Freizeit & Shopping": "#ec4899",
  "Gesundheit & Mobilität": "#14b8a6",
  "Sonstiges": "#94a3b8"
};

// Farbe für Einnahmen-Kategorien in der Tabelle (die gehören zu keiner Ausgaben-Gruppe)
export const EINNAHMEN_FARBE = "#16a34a";

export function gruppeFuer(kategorie) {
  for (const gruppe in KATEGORIE_GRUPPEN) {
    if (KATEGORIE_GRUPPEN[gruppe].includes(kategorie)) {
      return gruppe;
    }
  }
  return "Sonstiges";
}
