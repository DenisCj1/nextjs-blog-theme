const DEFAULTS = {
  enabled: true,
  loops: 2,
  instruction:
    'Critically review your previous answer. Identify any errors, gaps, weak reasoning, or missing detail, then rewrite it to be significantly more accurate, complete, and useful. Reply with ONLY the improved answer — no preamble.',
};

const $ = (id) => document.getElementById(id);
let savedTimer;

function flashSaved() {
  $('saved').textContent = 'Saved ✓';
  clearTimeout(savedTimer);
  savedTimer = setTimeout(() => ($('saved').textContent = ''), 1200);
}

function save() {
  const data = {
    enabled: $('enabled').checked,
    loops: Number($('loops').value),
    instruction: $('instruction').value.trim() || DEFAULTS.instruction,
  };
  chrome.storage.sync.set(data, flashSaved);
}

// Load existing settings.
chrome.storage.sync.get(DEFAULTS, (s) => {
  $('enabled').checked = s.enabled;
  $('loops').value = s.loops;
  $('loopsVal').textContent = s.loops;
  $('instruction').value = s.instruction;
});

$('enabled').addEventListener('change', save);
$('loops').addEventListener('input', () => {
  $('loopsVal').textContent = $('loops').value;
  save();
});
$('instruction').addEventListener('change', save);
