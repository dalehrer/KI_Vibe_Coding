# CLAUDE.md

Kleines Übungsprojekt: synthetischer Datensatz mit Kontotransaktionen eines Studenten in Deutschland plus Visualisierung des Kontostands. Alle Daten sind frei erfunden.

## Dateien

- `datensatz.csv`: die Transaktionen (Spalten: Datum, Transaktionen, Währung, Betrag, Beschreibung)
- `index.html`: nur Markup der Webseite, bindet CSS aus `css/`, `js/lib/chart.umd.min.js` und `js/main.js` (ES-Modul) ein; `favicon.svg` als Tab-Symbol
- `css/`: Design, getrennt nach Thema (`basis.css` mit Farb-Variablen in `:root` und `:root[data-theme="dark"]`, `kontostand.css` Kopfbereich, `filter.css` Filter + Zusammenfassungs-Pillen, `dashboard.css`, `tabelle.css`)
- `js/`: Code als ES-Module (Vanilla-JS, einzige Bibliothek: Chart.js 4.4.1 **lokal** in `js/lib/` mit `LICENSE-chartjs.txt`), je Datei ein Thema:
  - `main.js` Einstieg und Verdrahtung, `config.js` Startkontostand und Kategorie-Gruppen/Farben, `daten.js` CSV laden
  - `filter.js` Filter und Sortierung, `tabelle.js` Tabelle (Kategorie-Etiketten in Gruppenfarbe), `statistik.js` Berechnungen
  - `kontostand.js` (Kopfbereich mit Tiefst-/Höchststand), `zusammenfassung.js`, `karten.js`, `diagramme.js` Darstellung, `diagramm-stil.js` Diagrammfarben aus CSS-Variablen, `thema.js` Hell/Dunkel-Knopf, `format.js` Formatierung
- `README.md`: Aufgabenbeschreibung und Aufbau des Datensatzes

## Webseite

- Muss über einen lokalen Server laufen: `python -m http.server`, dann http://localhost:8000 (per Doppelklick scheitert `fetch`).
- Sortierung per Klick auf die Spaltenüberschrift (Pfeil ▲/▼, nochmal klicken dreht die Richtung um).
- Filter: Art (Alle/Ausgaben/Einnahmen), Kategorie (automatisch aus der CSV), Textsuche in der Beschreibung, Zurücksetzen.
- Ganz oben steht der aktuelle Kontostand (Startkontostand + alle Buchungen, mit Datum der letzten Buchung); er folgt den Filtern nicht.
- Zusammenfassung (Einnahmen/Ausgaben/Saldo) bezieht sich auf die gefilterten Zeilen.
- Kennzahlen-Karten (Ø Ausgaben/Monat, größte Einzelausgabe, teuerste Kategorie, Sparquote) und drei Diagramme (Chart.js 4.4.1, lokal eingebunden, kein Internet nötig): Kontostand-Verlauf (immer alle Buchungen, `STARTKONTOSTAND` = 500 in `js/config.js`), Ausgaben nach Bereich (Donut, die CSV-Kategorien sind in `KATEGORIE_GRUPPEN` in `js/config.js` zu 5 groben Gruppen zusammengefasst, unbekannte Kategorien landen in "Sonstiges"; neue Kategorien in der CSV dort eintragen) und Einnahmen/Ausgaben pro Monat (Balken). Karten, Donut und Balken folgen den Filtern.
- Fehlt Chart.js, bleibt die Seite funktionsfähig, die Diagramme werden dann ausgeblendet.
- Hell/Dunkel: Start nach Systemeinstellung, Knopf oben rechts. Diagrammfarben werden beim Umschalten aus den CSS-Variablen neu gelesen (`diagramm-stil.js`). Neue Farben immer als Variable in beiden Themes in `basis.css` anlegen.

## Veröffentlichung (rechtliche Vorgaben aus dem Kurs)

- Keine persönlichen Daten (keine echten Namen, IBANs, Adressen) und keine Zugangsdaten in Code, Daten oder Doku.
- **Kein Impressum** (zeitlich begrenztes Übungsprojekt).
- KI-Hinweis (fiktive, KI-generierte Daten und KI-unterstützte Webseite) oben auf der Seite, in der Fußzeile und in der README behalten.
- Keine externen Ressourcen einbinden (kein CDN, keine Google Fonts, kein Tracking), keine Cookies, kein localStorage: so bleibt der Datenschutz-Hinweis in der Fußzeile wahr.
- `<meta name="robots" content="noindex, nofollow">` behalten.
- Der Nutzer hat keine HTML-Vorkenntnisse: Code einfach halten und kurz kommentieren.

## Arbeitsweise

- `CLAUDE.md` und `README.md` bei jeder relevanten Änderung nebenbei aktuell halten, ohne dass der Nutzer es extra verlangt.
- **Dateien klein und thematisch getrennt halten** (Token sparen): Richtwert höchstens ca. 150 Zeilen pro Datei, `index.html` bleibt reines Markup ohne Inline-Script und Inline-Style. Wächst eine Datei darüber oder kommt ein neues Thema dazu, in eine neue Datei auslagern (neues Modul in `js/`, neue Datei in `css/`) und die Datei-Übersicht hier und in der README ergänzen.
- Neue Funktionen nicht in `main.js` stapeln: `main.js` verdrahtet nur, die Logik gehört in das passende Themenmodul.
- Änderungen im Browser prüfen, nicht nur schreiben: Server starten und Seite headless mit Edge laden (`msedge --headless --dump-dom` oder `--screenshot` gegen http://localhost:PORT/index.html). Node ist nicht installiert.

## Konventionen für datensatz.csv

- Trennzeichen: Komma mit Leerzeichen (`, `). Beschreibungen dürfen daher **keine Kommas** enthalten.
- Datum im Format `TT.MM.JJJJ`.
- Betrag mit Punkt als Dezimaltrennzeichen. Ausgaben negativ, Einnahmen positiv.
- Währung immer `EUR`.
- Beschreibungstexte realitätsnah wie auf echten Kontoauszügen und abwechslungsreich.
- Zeitraum Oktober 2023 bis 28.03.2024 (erste Buchung 02.10.2023), mindestens 10 Transaktionen pro Monat, nach Datum sortiert.
- Daueraufträge, Lastschriften und Gehälter nur an Werktagen (Mo-Fr) buchen. Am selben Tag Einnahmen vor Ausgaben, damit der Kontostand nicht künstlich ins Minus rutscht.
- Kontostand (Startwert 500 EUR) soll realistisch bleiben: nie negativ, tiefster Stand ca. 100 EUR, kein stetiges Anwachsen.
- Eine neue Kategorie in der CSV muss in `KATEGORIE_GRUPPEN` in `js/config.js` einer Gruppe zugeordnet werden (sonst "Sonstiges"). "Bargeld" ist absichtlich nicht zugeordnet.
- Nach jeder Änderung prüfen: 5 Felder je Zeile, keine Kommas in Beschreibungen, UTF-8 **ohne BOM** (sonst findet `js/daten.js` die Spalte "Datum" nicht).
- Wenn Zeilen hinzukommen oder wegfallen, README (Umfang, Zeitraum) aktuell halten.

## Code

- Nur Vanilla-JS (ES-Module), keine Build-Tools. Startkontostand: `STARTKONTOSTAND` (500 EUR) in `js/config.js`.
- Die README nennt nur Dinge, die auf die Webseite hochgeladen werden (keine Hilfsdateien wie `CLAUDE.md`).

## Sprache

Kommunikation, Kommentare, Beschriftungen und Doku auf Deutsch.
