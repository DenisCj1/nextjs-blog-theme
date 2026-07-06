/*
 * Loopy — content script
 * -----------------------
 * Injects a "↻ Loopy" button into ChatGPT / Claude. When clicked, it sends a
 * follow-up message asking the AI to critique and improve its own last answer,
 * and repeats that N times (the "loop"). Everything runs inside the user's own
 * chat session — Loopy never calls any AI API and no data leaves the browser.
 *
 * NOTE: These sites change their HTML often. All the site-specific selectors
 * live in the ADAPTERS below so they're easy to update in one place.
 */

(() => {
  'use strict';

  const DEFAULTS = {
    enabled: true,
    loops: 2, // how many improvement passes
    instruction:
      'Critically review your previous answer. Identify any errors, gaps, weak reasoning, or missing detail, then rewrite it to be significantly more accurate, complete, and useful. Reply with ONLY the improved answer — no preamble.',
  };

  // ---- Site adapters -------------------------------------------------------
  // Each adapter knows how to talk to one AI site's chat UI.
  const ADAPTERS = {
    chatgpt: {
      test: () => /chatgpt\.com|chat\.openai\.com/.test(location.host),
      // The composer is a contenteditable div (id may change over time).
      getComposer: () =>
        document.querySelector('#prompt-textarea') ||
        document.querySelector('div[contenteditable="true"]') ||
        document.querySelector('textarea'),
      getSendButton: () =>
        document.querySelector('[data-testid="send-button"]') ||
        document.querySelector('button[aria-label*="Send" i]'),
      // While the model is answering, a "Stop" button is shown.
      isGenerating: () =>
        !!document.querySelector('[data-testid="stop-button"]') ||
        !!document.querySelector('button[aria-label*="Stop" i]'),
      anchor: () =>
        document.querySelector('form') ||
        document.querySelector('#prompt-textarea')?.closest('div'),
    },
    claude: {
      test: () => /claude\.ai/.test(location.host),
      getComposer: () =>
        document.querySelector('div[contenteditable="true"]') ||
        document.querySelector('.ProseMirror'),
      getSendButton: () =>
        document.querySelector('button[aria-label*="Send" i]') ||
        document.querySelector('button[aria-label*="send message" i]'),
      isGenerating: () =>
        !!document.querySelector('button[aria-label*="Stop" i]'),
      anchor: () =>
        document.querySelector('div[contenteditable="true"]')?.closest('div'),
    },
  };

  const adapter = Object.values(ADAPTERS).find((a) => a.test());
  if (!adapter) return; // not on a supported site

  let settings = { ...DEFAULTS };
  chrome.storage?.sync.get(DEFAULTS, (s) => (settings = { ...DEFAULTS, ...s }));
  chrome.storage?.onChanged.addListener((changes) => {
    for (const k in changes) settings[k] = changes[k].newValue;
    updateButtonVisibility();
  });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Put text into the composer, whether it's a textarea or a contenteditable.
  function setComposerText(el, text) {
    if (!el) return false;
    el.focus();
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      setter ? setter.call(el, text) : (el.value = text);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // contenteditable
      el.textContent = text;
      el.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
    return true;
  }

  async function submitMessage(text) {
    const composer = adapter.getComposer();
    if (!composer) throw new Error('Loopy: could not find the message box.');
    setComposerText(composer, text);
    await sleep(120);
    const btn = adapter.getSendButton();
    if (btn && !btn.disabled) {
      btn.click();
    } else {
      // Fallback: press Enter.
      composer.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          bubbles: true,
        })
      );
    }
  }

  // Resolve once the model has started AND finished a fresh response.
  async function waitForResponse({ startTimeout = 8000, maxWait = 120000 } = {}) {
    const t0 = Date.now();
    // wait for generation to start
    while (!adapter.isGenerating() && Date.now() - t0 < startTimeout) {
      await sleep(150);
    }
    // wait for it to finish (with a settle delay so streaming truly ends)
    const t1 = Date.now();
    while (adapter.isGenerating() && Date.now() - t1 < maxWait) {
      await sleep(250);
    }
    await sleep(600);
  }

  // ---- The loop ------------------------------------------------------------
  let running = false;

  async function runLoop(btn) {
    if (running) return;
    running = true;
    const original = btn.textContent;
    btn.classList.add('loopy-busy');

    try {
      const passes = Math.max(1, Math.min(5, Number(settings.loops) || 2));
      for (let i = 1; i <= passes; i++) {
        btn.textContent = `↻ Improving ${i}/${passes}…`;
        await submitMessage(settings.instruction);
        await waitForResponse();
      }
      btn.textContent = '✓ Done';
      await sleep(1400);
    } catch (err) {
      console.error(err);
      btn.textContent = '⚠ ' + (err.message || 'Loopy error');
      await sleep(2600);
    } finally {
      btn.textContent = original;
      btn.classList.remove('loopy-busy');
      running = false;
    }
  }

  // ---- Button injection ----------------------------------------------------
  const BTN_ID = 'loopy-button';

  function makeButton() {
    const b = document.createElement('button');
    b.id = BTN_ID;
    b.type = 'button';
    b.textContent = '↻ Loopy';
    b.title =
      'Loopy: make the AI critique and improve its own last answer (' +
      (settings.loops || 2) +
      ' passes)';
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      runLoop(b);
    });
    return b;
  }

  function ensureButton() {
    if (!settings.enabled) return;
    if (document.getElementById(BTN_ID)) return;
    const anchor = adapter.anchor() || document.body;
    const btn = makeButton();
    document.body.appendChild(btn); // fixed-position via CSS, so body is fine
  }

  function updateButtonVisibility() {
    const existing = document.getElementById(BTN_ID);
    if (settings.enabled && !existing) ensureButton();
    if (!settings.enabled && existing) existing.remove();
  }

  // The chat UIs re-render constantly; keep the button alive.
  const mo = new MutationObserver(() => ensureButton());
  mo.observe(document.body, { childList: true, subtree: true });

  // Initial injection (settings load is async, so retry briefly).
  const boot = setInterval(() => {
    if (settings.enabled) {
      ensureButton();
      clearInterval(boot);
    }
  }, 400);
  setTimeout(() => clearInterval(boot), 8000);
})();
