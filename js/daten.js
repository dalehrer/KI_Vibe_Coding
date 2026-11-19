// CSV laden und in Buchungen umwandeln

// Gemeinsamer Datenspeicher, den alle anderen Module nur lesen
export const daten = {
  kopf: [],       // Spaltenüberschriften
  buchungen: [],  // jede Buchung: { felder: [...], datum: Date, betrag: Zahl }
  spalten: {}     // Spaltennummern: datum, kategorie, waehrung, betrag, beschreibung
};

export async function ladeDaten(pfad) {
  // "no-cache": Der Browser fragt beim Server nach, ob sich die CSV geändert hat
  // (sonst zeigt er nach einer Änderung evtl. noch die alte Version aus dem Cache)
  const antwort = await fetch(pfad, { cache: "no-cache" });
  if (!antwort.ok) {
    throw new Error("Datei nicht gefunden (Status " + antwort.status + ")");
  }
  const zeilen = (await antwort.text()).trim().split(/\r?\n/);

  // Erste Zeile = Spaltenüberschriften, getrennt durch ", "
  daten.kopf = zeilen[0].split(", ");
  daten.spalten = {
    datum: daten.kopf.indexOf("Datum"),
    kategorie: daten.kopf.indexOf("Transaktionen"),
    waehrung: daten.kopf.indexOf("Währung"),
    betrag: daten.kopf.indexOf("Betrag"),
    beschreibung: daten.kopf.indexOf("Beschreibung")
  };

  daten.buchungen = zeilen.slice(1).map((zeile) => {
    const felder = zeile.split(", ");
    const teile = felder[daten.spalten.datum].split("."); // TT.MM.JJJJ
    return {
      felder: felder,
      datum: new Date(teile[2], teile[1] - 1, teile[0]),
      betrag: parseFloat(felder[daten.spalten.betrag])
    };
  });
}

// Anzahl der Monate im gesamten Datensatz (für den Monatsdurchschnitt)
export function anzahlMonate() {
  const monate = new Set();
  daten.buchungen.forEach((b) => monate.add(b.datum.getFullYear() + "-" + b.datum.getMonth()));
  return monate.size;
}
