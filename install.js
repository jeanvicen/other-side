(() => {
  "use strict";

  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true;

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isTouchDevice =
    "ontouchstart" in window || window.navigator.maxTouchPoints > 0;
  const wasDismissed = () => {
    try {
      return window.sessionStorage.getItem("other-side-install-dismissed") === "1";
    } catch (_error) {
      return false;
    }
  };

  const rememberDismissal = () => {
    try {
      window.sessionStorage.setItem("other-side-install-dismissed", "1");
    } catch (_error) {
      // Storage can be unavailable in private browsing; the prompt still works.
    }
  };

  if (isStandalone()) {
    registerServiceWorker();
    return;
  }

  const style = document.createElement("style");
  style.textContent = `
    #other-side-install {
      position: fixed;
      z-index: 20;
      top: max(14px, env(safe-area-inset-top));
      right: max(14px, env(safe-area-inset-right));
      width: min(290px, calc(100vw - 28px));
      padding: 14px;
      color: #f2efff;
      background: rgba(8, 7, 19, .96);
      border: 1px solid #7770bd;
      box-shadow: 0 10px 30px rgba(0, 0, 0, .5), 0 0 22px rgba(111, 74, 255, .22);
      font: 12px/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      letter-spacing: .02em;
      pointer-events: auto;
      user-select: none;
      -webkit-user-select: none;
    }

    #other-side-install[hidden] {
      display: none;
    }

    #other-side-install::before {
      content: "";
      display: block;
      height: 2px;
      margin: -14px -14px 12px;
      background: linear-gradient(90deg, #d33, #8c75ff, transparent);
    }

    #other-side-install strong {
      display: block;
      margin-bottom: 5px;
      color: #fff;
      font-size: 15px;
      letter-spacing: .12em;
    }

    #other-side-install p {
      margin: 0 0 12px;
      color: #aaa6c8;
    }

    #other-side-install .os-install-actions {
      display: flex;
      gap: 8px;
    }

    #other-side-install button {
      min-height: 34px;
      padding: 7px 10px;
      border: 1px solid #7770bd;
      color: #f4f0ff;
      background: #17142b;
      font: inherit;
      letter-spacing: .08em;
      cursor: pointer;
      touch-action: manipulation;
    }

    #other-side-install button[data-action="install"] {
      flex: 1;
      border-color: #c33;
      background: #32141c;
    }

    #other-side-install button:active {
      transform: translateY(1px);
      filter: brightness(1.3);
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("section");
  panel.id = "other-side-install";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Instalar OTHER SIDE");
  panel.innerHTML = `
    <strong>INSTALAR?</strong>
    <p data-copy>Leve OTHER SIDE para a tela inicial e abra o jogo sem a barra do navegador.</p>
    <div class="os-install-actions">
      <button type="button" data-action="install">INSTALAR</button>
      <button type="button" data-action="later">AGORA NÃO</button>
    </div>
  `;
  document.body.appendChild(panel);

  const installButton = panel.querySelector('[data-action="install"]');
  const laterButton = panel.querySelector('[data-action="later"]');
  const copy = panel.querySelector("[data-copy]");
  let deferredPrompt = null;

  const show = () => {
    if (!wasDismissed()) panel.hidden = false;
  };

  const hide = (remember = false) => {
    panel.hidden = true;
    if (remember) rememberDismissal();
  };

  const showManualHelp = () => {
    if (isIOS) {
      copy.textContent = "No iPhone ou iPad: toque em Compartilhar e depois em Adicionar à Tela de Início.";
    } else {
      copy.textContent = "Abra o menu do navegador e escolha Instalar app ou Adicionar à tela inicial.";
    }
    installButton.textContent = "ENTENDI";
    installButton.dataset.action = "help-done";
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.textContent = "INSTALAR";
    installButton.dataset.action = "install";
    show();
  });

  installButton.addEventListener("click", async () => {
    if (installButton.dataset.action === "help-done") {
      hide(true);
      return;
    }

    if (!deferredPrompt) {
      showManualHelp();
      return;
    }

    const promptEvent = deferredPrompt;
    deferredPrompt = null;
    await promptEvent.prompt();
    hide(true);
  });

  laterButton.addEventListener("click", () => hide(true));

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    hide(true);
  });

  registerServiceWorker();

  // On touch devices, make the custom “Instalar?” invitation visible on first visit.
  // On desktop, the panel only appears after Chromium signals that installation is ready.
  if (isTouchDevice && !wasDismissed()) {
    window.setTimeout(show, 1800);
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(() => {
          // The game remains fully playable if the server does not expose service workers.
        });
      }, { once: true });
    }
  }
})();
