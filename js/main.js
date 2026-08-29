import { startApp } from "./app.js";

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((reg) => {
      console.log("Service worker registered:", reg.scope);
    }).catch((err) => {
      console.error("Service worker registration failed:", err);
    });
  });
}

registerServiceWorker();
startApp(document.getElementById("app"));
