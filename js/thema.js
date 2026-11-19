// Helles / dunkles Design umschalten.
// Start: wie im Betriebssystem eingestellt. Es wird nichts gespeichert (keine Cookies, kein localStorage).

const wurzel = document.documentElement;

function setzeThema(thema) {
  wurzel.dataset.theme = thema;
  document.getElementById("thema-knopf").textContent = thema === "dark" ? "☀ Hell" : "☾ Dunkel";
}

// "beiWechsel" wird nach jedem Umschalten aufgerufen (z. B. um Diagramme neu einzufärben)
export function starteThema(beiWechsel) {
  const systemDunkel = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setzeThema(systemDunkel ? "dark" : "light");

  document.getElementById("thema-knopf").addEventListener("click", () => {
    setzeThema(wurzel.dataset.theme === "dark" ? "light" : "dark");
    beiWechsel();
  });
}
