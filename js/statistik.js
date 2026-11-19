// Auswertung der gefilterten Buchungen (reine Berechnung, kein Zeichnen)

import { daten } from "./daten.js";
import { gruppeFuer } from "./config.js";

// Liefert Summen insgesamt, je Kategorie, je Gruppe und je Monat.
// Hinweis: "ausgaben" ist negativ, in proKategorie/proGruppe/proMonat sind Ausgaben positiv.
export function berechneStatistik(treffer) {
  const s = daten.spalten;
  const stat = {
    einnahmen: 0,
    ausgaben: 0,
    proKategorie: {},
    proGruppe: {},
    proMonat: {},
    groessteAusgabe: null
  };

  treffer.forEach((b) => {
    const monat = b.datum.getFullYear() * 100 + b.datum.getMonth(); // sortierbarer Schlüssel
    if (!stat.proMonat[monat]) {
      stat.proMonat[monat] = { datum: b.datum, einnahmen: 0, ausgaben: 0 };
    }

    if (b.betrag >= 0) {
      stat.einnahmen += b.betrag;
      stat.proMonat[monat].einnahmen += b.betrag;
      return;
    }

    const kategorie = b.felder[s.kategorie];
    const gruppe = gruppeFuer(kategorie);
    stat.ausgaben += b.betrag;
    stat.proKategorie[kategorie] = (stat.proKategorie[kategorie] || 0) - b.betrag;
    stat.proGruppe[gruppe] = (stat.proGruppe[gruppe] || 0) - b.betrag;
    stat.proMonat[monat].ausgaben -= b.betrag;

    if (!stat.groessteAusgabe || b.betrag < stat.groessteAusgabe.betrag) {
      stat.groessteAusgabe = b;
    }
  });

  return stat;
}

// Schlüssel eines Objekts nach Wert sortieren (größte zuerst)
export function nachSummeSortiert(summen) {
  return Object.keys(summen).sort((a, b) => summen[b] - summen[a]);
}
