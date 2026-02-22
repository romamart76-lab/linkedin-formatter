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
  const reverseMaps = [BOLD_MAP, ITALIC_MAP, BOLD_ITALIC_MAP];
  const reverseMap = {};
  for (const map of reverseMaps) {
    for (const [ascii, unicode] of Object.entries(map)) {
      reverseMap[unicode] = ascii;
    }
  }
  return [...text].map(ch => reverseMap[ch] || ch).join('');
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
// Event listeners
// ============================================================
document.getElementById('btn-bold').addEventListener('click', () => applyFormat(BOLD_MAP));
document.getElementById('btn-italic').addEventListener('click', () => applyFormat(ITALIC_MAP));
document.getElementById('btn-bolditalic').addEventListener('click', () => applyFormat(BOLD_ITALIC_MAP));
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
  }
});
