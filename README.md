# Studentenkonto: fiktive Kontotransaktionen mit Web-Dashboard

Übungsprojekt: ein synthetischer Datensatz mit Banktransaktionen eines Studenten in Deutschland ([datensatz.csv](datensatz.csv)) und eine Webseite ([index.html](index.html)), die den Datensatz als interaktives Dashboard mit Kennzahlen, Diagrammen und filterbarer Tabelle darstellt.

> **KI-Hinweis:** Der Datensatz ist **frei erfunden und mit KI generiert**. Er enthält keine echten Kontodaten und keine Daten realer Personen. Auch der Code der Webseite und diese Dokumentation wurden mit KI-Unterstützung (Claude von Anthropic) erstellt und anschließend geprüft.

## Aufgabe

Es soll ein realistischer, synthetischer Datensatz mit Banktransaktionen eines "normalen" Studenten in Deutschland erzeugt und auf einer Webseite visualisiert werden.

Rahmenbedingungen:

- Kontotransaktionen eines durchschnittlichen Studenten in Deutschland
- Zeitraum von 6 Monaten
- Mindestens 10 Transaktionen pro Monat
- CSV-Tabelle mit Spaltenüberschriften
- Möglichst vielfältige und realitätsnahe Beschreibungstexte, wie sie auch auf echten Kontoauszügen vorkommen

## Datensatz

- **Datei:** `datensatz.csv` (UTF-8 ohne BOM, Trennzeichen Komma mit Leerzeichen `, `)
- **Zeitraum:** 02.10.2023 bis 28.03.2024 (Wintersemester, Semesterferien und Beginn des Sommersemesters)
- **Umfang:** 170 Transaktionen, 26 bis 30 pro Monat, 24 Kategorien
- **Währung:** EUR
- **Realismus:** Daueraufträge, Lastschriften und Gehälter werden nur an Bankarbeitstagen gebucht (fällt der 1. auf ein Wochenende, rutscht die Buchung auf den nächsten Werktag). Kartenzahlungen kommen auch am Wochenende vor. Der Kontostand schwankt zwischen ca. 118 € und 1.112 € (angenommener Startkontostand 500 €) und liegt am Ende bei ca. 618 €.

### Spalten

| Spalte | Beschreibung |
|---|---|
| Datum | Buchungsdatum im Format TT.MM.JJJJ |
| Transaktionen | Kategorie der Transaktion (z. B. Miete, Lebensmittel, BAföG) |
| Währung | Währung des Betrags (immer EUR) |
| Betrag | Betrag mit Punkt als Dezimaltrennzeichen. Ausgaben sind negativ, Einnahmen positiv |
| Beschreibung | Verwendungszweck bzw. Buchungstext (ohne Kommas) |

### Enthaltene Einnahmen

- BAföG (monatlich 534 €, zum Monatsanfang, als Teilförderung)
- Gehalt als Hilfskraft an der Universität (am Monatsende, je nach Stundenzahl 241 € bis 329 €)
- monatlicher Dauerauftrag der Eltern (150 €)
- gelegentliche Zuwendungen: Geburtstags- und Weihnachtsgeld, Zuschuss der Eltern
- kleine Beträge von Freunden (PayPal-Ausgleich) und Erstattungen (Retoure)

### Enthaltene Ausgaben

- **Feste Kosten:** Miete (WG-Zimmer), Nebenkosten (Strom und Internet als WG-Anteil), Handytarif, Spotify, Fitnessstudio (ab Januar), Rundfunkbeitrag (WG-Anteil, quartalsweise), Haftpflichtversicherung (Jahresbeitrag), Semesterbeitrag
- **Variable Kosten:** Lebensmittel, Mensa, Gastronomie, Drogerie, Kleidung, Lernmaterial, Freizeit, Verkehr, Gesundheit, Haushalt, Bargeldabhebungen
- **Besondere Posten:** Weihnachtsgeschenke, Prüfungsgebühr, Nebenkosten-Nachzahlung, Städtetrip im Februar, Konzertkarte, Mahngebühr der Bibliothek, Aufnahmegebühr im Fitnessstudio

In den Buchungstexten kommen echte Firmen- und Markennamen vor (z. B. REWE, Deutsche Bahn), damit sie wie auf einem echten Kontoauszug aussehen. Alle Buchungen selbst sind erfunden.

## Webseite

### Starten (Webserver nötig)

Die Seite lädt die CSV per `fetch`. Browser erlauben das nicht, wenn man `index.html` einfach per Doppelklick öffnet. Die Seite braucht deshalb einen (beliebigen) Webserver:

- **Lokal:** Im Projektordner `python -m http.server` ausführen und im Browser http://localhost:8000 öffnen.
- **Online:** Den Projektordner auf einen statischen Webspace hochladen (z. B. GitHub Pages oder Uni-Webspace). Eine Server-Software wie PHP oder eine Datenbank ist nicht nötig, es reicht das Ausliefern der Dateien.

Eine Internetverbindung braucht die Seite nicht: Die Diagramm-Bibliothek Chart.js liegt lokal im Ordner `js/lib/`.

### Funktionen

- **Kopfbereich:** aktueller Kontostand (Startkontostand + alle Buchungen) mit Datum der letzten Buchung, Veränderung seit Start sowie Tiefst- und Höchststand
- **Hell/Dunkel:** Knopf oben rechts. Beim Laden richtet sich die Seite nach der Einstellung des Betriebssystems.
- **Filter** (bleiben beim Scrollen oben sichtbar): Art (Ausgaben/Einnahmen), Kategorie, Textsuche in der Beschreibung, Zurücksetzen-Button
- **Zusammenfassung:** Einnahmen, Ausgaben und Saldo der angezeigten Zeilen
- **Kennzahlen:** durchschnittliche Ausgaben pro Monat, größte Einzelausgabe, teuerste Kategorie, Sparquote
- **Diagramme** (Chart.js):
  - Kontostand-Verlauf über alle Buchungen (Startkontostand 500 € angenommen)
  - Ausgaben nach Bereich als Donut (grobe Gruppen: Wohnen & Fixkosten, Essen & Trinken, Uni & Bildung, Freizeit & Shopping, Gesundheit & Mobilität)
  - Einnahmen und Ausgaben pro Monat als Balken
- **Tabelle:** Sortieren per Klick auf eine Spaltenüberschrift (Pfeil zeigt die Richtung, erneuter Klick dreht sie um). Kategorien als farbige Etiketten (Farbe = Bereich, Einnahmen grün).

Kennzahlen, Zusammenfassung, Donut und Balkendiagramm passen sich den Filtern an. Kontostand und Kontostand-Verlauf zeigen immer alle Buchungen.

### Aufbau

`index.html` enthält nur das Grundgerüst. Design und Code liegen in kleinen, thematisch getrennten Dateien:

| Ordner/Datei | Inhalt |
|---|---|
| `favicon.svg` | Symbol im Browser-Tab |
| `css/basis.css` | Farben für Hell und Dunkel, Schrift, Seitenlayout, Hinweise, Fußzeile |
| `css/kontostand.css` | Kopfbereich mit Kontostand und Hell/Dunkel-Knopf |
| `css/filter.css` | Filter-Leiste und Zusammenfassung |
| `css/dashboard.css` | Kennzahlen-Karten und Diagramme |
| `css/tabelle.css` | Tabelle |
| `js/main.js` | Einstieg: lädt Daten, verdrahtet die Bedienelemente |
| `js/config.js` | Startkontostand, Kategorie-Gruppen und Farben |
| `js/daten.js` | CSV laden und parsen |
| `js/filter.js` | Filter und Sortierung |
| `js/tabelle.js` | Tabelle zeichnen, Sortier-Pfeile, Kategorie-Etiketten |
| `js/statistik.js` | Summen und Auswertungen berechnen |
| `js/kontostand.js` | Kontostand im Kopfbereich |
| `js/zusammenfassung.js` | Statuszeile und Einnahmen/Ausgaben/Saldo |
| `js/karten.js` | Kennzahlen-Karten |
| `js/diagramme.js` | Diagramme anlegen und aktualisieren |
| `js/diagramm-stil.js` | Diagrammfarben passend zu Hell/Dunkel |
| `js/thema.js` | Umschalten Hell/Dunkel |
| `js/format.js` | Formatierung von Beträgen und Datum |
| `js/lib/chart.umd.min.js` | Chart.js 4.4.1 (fremde Bibliothek, MIT-Lizenz, siehe `js/lib/LICENSE-chartjs.txt`) |

## Hinweise zur Veröffentlichung

- **Keine persönlichen Daten:** Datensatz, Code und Doku enthalten keine echten Namen, Kontonummern (IBAN) oder Adressen.
- **Keine Zugangsdaten:** Es gibt keine Passwörter, API-Schlüssel oder Logins für andere Dienste im Projekt.
- **Datenschutz:** Die Seite setzt keine Cookies, speichert nichts im Browser (auch nicht die Hell/Dunkel-Wahl) und lädt keine Inhalte von fremden Servern (keine externen Schriftarten, kein CDN, kein Tracking). Der Hoster kann technisch bedingt Zugriffe protokollieren (Server-Logs).
- **Kein Impressum:** Die Seite ist nur ein zeitlich begrenztes Übungsprojekt ohne kommerziellen Zweck. Damit keine unnötigen persönlichen Daten online stehen, gibt es bewusst kein Impressum.
- **Suchmaschinen:** Die Seite ist per `<meta name="robots" content="noindex, nofollow">` von der Indexierung ausgeschlossen.
- **Lizenzen:** Chart.js steht unter der MIT-Lizenz, der Lizenztext liegt bei (`js/lib/LICENSE-chartjs.txt`) und ist in der Fußzeile verlinkt.

### Was hochgeladen wird

`index.html`, `favicon.svg`, `datensatz.csv`, die Ordner `css/` und `js/` (inklusive `js/lib/`) und diese `README.md`.