// ============================================================
// Unicode character maps for LinkedIn-compatible formatting
// ============================================================
const BOLD_MAP = {};
const ITALIC_MAP = {};
const BOLD_ITALIC_MAP = {};

for (let i = 0; i < 26; i++) {
  const upper = String.fromCharCode(65 + i);
  const lower = String.fromCharCode(97 + i);
  BOLD_MAP[upper] = String.fromCodePoint(0x1D400 + i);
  BOLD_MAP[lower] = String.fromCodePoint(0x1D41A + i);
  ITALIC_MAP[upper] = String.fromCodePoint(0x1D434 + i);
  ITALIC_MAP[lower] = String.fromCodePoint(0x1D44E + i);
  BOLD_ITALIC_MAP[upper] = String.fromCodePoint(0x1D468 + i);
  BOLD_ITALIC_MAP[lower] = String.fromCodePoint(0x1D482 + i);
}
ITALIC_MAP['h'] = String.fromCodePoint(0x210E);

for (let i = 0; i < 10; i++) {
  const digit = String.fromCharCode(48 + i);
  BOLD_MAP[digit] = String.fromCodePoint(0x1D7CE + i);
  BOLD_ITALIC_MAP[digit] = String.fromCodePoint(0x1D7CE + i);
}

// Underline: combining underline character U+0332
const UNDERLINE_MAP = {};
for (let i = 32; i < 127; i++) {
  const ch = String.fromCharCode(i);
  UNDERLINE_MAP[ch] = ch + '\u0332';
}

// Strikethrough: combining strikethrough U+0336
const STRIKETHROUGH_MAP = {};
for (let i = 32; i < 127; i++) {
  const ch = String.fromCharCode(i);
  STRIKETHROUGH_MAP[ch] = ch + '\u0336';
}

// Monospace: Mathematical Monospace (U+1D670)
const MONO_MAP = {};
for (let i = 0; i < 26; i++) {
  MONO_MAP[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1D670 + i);
  MONO_MAP[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1D68A + i);
}
for (let i = 0; i < 10; i++) {
  MONO_MAP[String.fromCharCode(48 + i)] = String.fromCodePoint(0x1D7F6 + i);
}

// Script/Cursive: Mathematical Script (U+1D49C)
const SCRIPT_MAP = {};
for (let i = 0; i < 26; i++) {
  SCRIPT_MAP[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1D49C + i);
  SCRIPT_MAP[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1D4B6 + i);
}
// Fix known script exceptions
SCRIPT_MAP['B'] = '\u212C'; // ℬ
SCRIPT_MAP['E'] = '\u2130'; // ℰ
SCRIPT_MAP['F'] = '\u2131'; // ℱ
SCRIPT_MAP['H'] = '\u210B'; // ℋ
SCRIPT_MAP['I'] = '\u2110'; // ℐ
SCRIPT_MAP['L'] = '\u2112'; // ℒ
SCRIPT_MAP['M'] = '\u2133'; // ℳ
SCRIPT_MAP['R'] = '\u211B'; // ℛ
SCRIPT_MAP['e'] = '\u212F'; // ℯ
SCRIPT_MAP['g'] = '\u210A'; // ℊ
SCRIPT_MAP['o'] = '\u2134'; // ℴ

// Double-Struck: Mathematical Double-Struck (U+1D538)
const DOUBLE_MAP = {};
for (let i = 0; i < 26; i++) {
  DOUBLE_MAP[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1D538 + i);
  DOUBLE_MAP[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1D552 + i);
}
for (let i = 0; i < 10; i++) {
  DOUBLE_MAP[String.fromCharCode(48 + i)] = String.fromCodePoint(0x1D7D8 + i);
}
// Fix known double-struck exceptions
DOUBLE_MAP['C'] = '\u2102'; // ℂ
DOUBLE_MAP['H'] = '\u210D'; // ℍ
DOUBLE_MAP['N'] = '\u2115'; // ℕ
DOUBLE_MAP['P'] = '\u2119'; // ℙ
DOUBLE_MAP['Q'] = '\u211A'; // ℚ
DOUBLE_MAP['R'] = '\u211D'; // ℝ
DOUBLE_MAP['Z'] = '\u2124'; // ℤ

// All format maps for easy reference
const ALL_MAPS = {
  bold: BOLD_MAP,
  italic: ITALIC_MAP,
  bolditalic: BOLD_ITALIC_MAP,
  underline: UNDERLINE_MAP,
  strikethrough: STRIKETHROUGH_MAP,
  mono: MONO_MAP,
  script: SCRIPT_MAP,
  double: DOUBLE_MAP,
};

// ============================================================
// Emoji categories
// ============================================================
const EMOJI_CATEGORIES = {
  frequent: [], // populated from usage tracking
  business: ['💼', '📊', '📈', '📉', '💰', '💵', '🏆', '🎯', '📋', '📌', '🤝', '💡', '🚀', '📅', '⏰', '🔔', '🏢', '📣', '🎓', '💎'],
  reactions: ['😊', '😂', '🤔', '😅', '🥳', '😍', '🤩', '😎', '🙄', '😤', '😢', '🤯', '😬', '🫡', '🫠', '🤓'],
  symbols: ['✅', '❌', '⭐', '🔥', '✨', '💪', '⚡', '👉', '👆', '➡️', '⬆️', '🔹', '🔸', '▶️', '◾', '📍', '🔗', '💬', '📝', '🔑'],
  tech: ['💻', '🤖', '🌐', '📱', '🔧', '⚙️', '🛠️', '📡', '🔒', '🔓', '☁️', '📦', '🧪', '🧠', '🔬', '📂'],
  hands: ['👏', '🙏', '🤝', '👍', '👎', '✌️', '🤞', '🫶', '👋', '✋', '🤙', '💪', '🙌', '🫰', '👊', '🤘'],
};

// Default frequent emojis (before any usage data)
const DEFAULT_FREQUENT = ['🎯', '💡', '🚀', '✅', '👉', '📌', '🔥', '✨', '💪', '⚡', '👏', '🤝', '💼', '📊', '📈', '🏆', '💰', '🤔', '😊', '🙏'];

// ============================================================
// Usage tracking (stored in localStorage)
// ============================================================
const STORAGE_KEY = 'li-formatter-emoji-usage';

function getEmojiUsage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function trackEmojiUsage(emoji) {
  const usage = getEmojiUsage();
  usage[emoji] = (usage[emoji] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  updateFrequentPanel();
}

function getFrequentEmojis() {
  const usage = getEmojiUsage();
  const entries = Object.entries(usage);
  if (entries.length < 5) return DEFAULT_FREQUENT;

  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([emoji]) => emoji);
}

// ============================================================
// DOM setup
// ============================================================
const input = document.getElementById('input');
const output = document.getElementById('output');
const charCount = document.getElementById('char-count');
const toast = document.getElementById('toast');

// Build emoji panels
function buildEmojiPanels() {
  for (const [category, emojis] of Object.entries(EMOJI_CATEGORIES)) {
    const panel = document.querySelector(`[data-panel="${category}"]`);
    if (!panel) continue;
    const list = category === 'frequent' ? getFrequentEmojis() : emojis;
    panel.innerHTML = '';
    for (const emoji of list) {
      const btn = document.createElement('button');
      btn.className = 'emoji-btn';
      btn.textContent = emoji;
      btn.dataset.emoji = emoji;
      btn.addEventListener('click', () => {
        insertAtCursor(emoji + ' ');
        trackEmojiUsage(emoji);
      });
      panel.appendChild(btn);
    }
  }
}

function updateFrequentPanel() {
  const panel = document.querySelector('[data-panel="frequent"]');
  if (!panel) return;
  const emojis = getFrequentEmojis();
  panel.innerHTML = '';
  for (const emoji of emojis) {
    const btn = document.createElement('button');
    btn.className = 'emoji-btn';
    btn.textContent = emoji;
    btn.dataset.emoji = emoji;
    btn.addEventListener('click', () => {
      insertAtCursor(emoji + ' ');
      trackEmojiUsage(emoji);
    });
    panel.appendChild(btn);
  }
}

buildEmojiPanels();

// Emoji tab switching
document.querySelectorAll('.emoji-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.emoji-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('active');
  });
});

// ============================================================
// Text formatting
// ============================================================
function convertText(text, charMap) {
  return [...text].map(ch => charMap[ch] || ch).join('');
}

function stripUnicode(text) {
  // Build reverse map from all unicode format maps
  const reverseMap = {};
  for (const [name, map] of Object.entries(ALL_MAPS)) {
    if (name === 'underline' || name === 'strikethrough') continue; // handled separately
    for (const [ascii, unicode] of Object.entries(map)) {
      reverseMap[unicode] = ascii;
    }
  }
  // Remove combining characters (underline U+0332, strikethrough U+0336)
  const cleaned = text.replace(/[\u0332\u0336]/g, '');
  return [...cleaned].map(ch => reverseMap[ch] || ch).join('');
}

function applyFormat(charMap) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  if (start === end) return;

  const before = input.value.substring(0, start);
  const selected = input.value.substring(start, end);
  const after = input.value.substring(end);

  const plain = stripUnicode(selected);
  const formatted = convertText(plain, charMap);

  input.value = before + formatted + after;
  input.selectionStart = start;
  input.selectionEnd = start + formatted.length;
  input.focus();
  updatePreview();
}

function insertBullet() {
  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === end) {
    insertAtCursor('• ');
    return;
  }

  const before = input.value.substring(0, start);
  const selected = input.value.substring(start, end);
  const after = input.value.substring(end);

  const bulleted = selected
    .split('\n')
    .map(line => line.trim() ? '• ' + line.trim() : line)
    .join('\n');

  input.value = before + bulleted + after;
  input.selectionStart = start;
  input.selectionEnd = start + bulleted.length;
  input.focus();
  updatePreview();
}

function insertNumbered() {
  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === end) {
    insertAtCursor('1. ');
    return;
  }

  const before = input.value.substring(0, start);
  const selected = input.value.substring(start, end);
  const after = input.value.substring(end);

  let num = 1;
  const numbered = selected
    .split('\n')
    .map(line => line.trim() ? `${num++}. ${line.trim()}` : line)
    .join('\n');

  input.value = before + numbered + after;
  input.selectionStart = start;
  input.selectionEnd = start + numbered.length;
  input.focus();
  updatePreview();
}

function clearFormatting() {
  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === end) {
    input.value = stripUnicode(input.value);
  } else {
    const before = input.value.substring(0, start);
    const selected = input.value.substring(start, end);
    const after = input.value.substring(end);
    const plain = stripUnicode(selected);
    input.value = before + plain + after;
    input.selectionStart = start;
    input.selectionEnd = start + plain.length;
  }
  input.focus();
  updatePreview();
}

function insertAtCursor(text) {
  const start = input.selectionStart;
  const before = input.value.substring(0, start);
  const after = input.value.substring(input.selectionEnd);

  input.value = before + text + after;
  input.selectionStart = input.selectionEnd = start + text.length;
  input.focus();
  updatePreview();
}

function updatePreview() {
  const text = input.value;
  output.textContent = text || '';

  const len = text.length;
  charCount.textContent = `${len.toLocaleString()} / 3,000`;
  charCount.classList.toggle('warning', len > 2500 && len <= 3000);
  charCount.classList.toggle('danger', len > 3000);
  updateLinkedInPreview();
}

async function copyToClipboard() {
  const text = input.value;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied! ✅');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied! ✅');
  }
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 1500);
}

// ============================================================
// LinkedIn Preview
// ============================================================
const liPreviewToggle = document.getElementById('btn-linkedin-preview');
const liPreview = document.getElementById('linkedin-preview');
const liBody = document.getElementById('li-body');

liPreviewToggle.addEventListener('click', () => {
  liPreview.classList.toggle('hidden');
  updateLinkedInPreview();
});

function updateLinkedInPreview() {
  if (liPreview.classList.contains('hidden')) return;
  liBody.textContent = input.value || 'Your post will appear here...';
}

// ============================================================
// Templates
// ============================================================
const templatesToggle = document.getElementById('btn-templates');
const templatesList = document.getElementById('templates-list');

if (typeof TEMPLATES !== 'undefined') {
  for (const tmpl of TEMPLATES) {
    const btn = document.createElement('button');
    btn.className = 'template-item';
    btn.innerHTML = `<span class="template-name">${tmpl.name}</span><span class="template-category">${tmpl.category}</span>`;
    btn.addEventListener('click', () => {
      input.value = tmpl.template;
      input.focus();
      updatePreview();
      // Collapse templates after selection
      templatesList.classList.add('hidden');
      templatesToggle.classList.remove('open');
    });
    templatesList.appendChild(btn);
  }
}

templatesToggle.addEventListener('click', () => {
  templatesList.classList.toggle('hidden');
  templatesToggle.classList.toggle('open');
});

// ============================================================
// Event listeners
// ============================================================
document.getElementById('btn-bold').addEventListener('click', () => applyFormat(BOLD_MAP));
document.getElementById('btn-italic').addEventListener('click', () => applyFormat(ITALIC_MAP));
document.getElementById('btn-bolditalic').addEventListener('click', () => applyFormat(BOLD_ITALIC_MAP));
document.getElementById('btn-underline').addEventListener('click', () => applyFormat(UNDERLINE_MAP));
document.getElementById('btn-strike').addEventListener('click', () => applyFormat(STRIKETHROUGH_MAP));
document.getElementById('btn-mono').addEventListener('click', () => applyFormat(MONO_MAP));
document.getElementById('btn-script').addEventListener('click', () => applyFormat(SCRIPT_MAP));
document.getElementById('btn-double').addEventListener('click', () => applyFormat(DOUBLE_MAP));
document.getElementById('btn-bullet').addEventListener('click', () => insertBullet());
document.getElementById('btn-numbered').addEventListener('click', () => insertNumbered());
document.getElementById('btn-line').addEventListener('click', () => insertAtCursor('\n\n'));
document.getElementById('btn-clear').addEventListener('click', () => clearFormatting());
document.getElementById('btn-copy').addEventListener('click', copyToClipboard);

input.addEventListener('input', updatePreview);
input.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'b') { e.preventDefault(); applyFormat(BOLD_MAP); }
    if (e.key === 'i') { e.preventDefault(); applyFormat(ITALIC_MAP); }
    if (e.key === 'u') { e.preventDefault(); applyFormat(UNDERLINE_MAP); }
  }
});
