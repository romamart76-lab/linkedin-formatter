// Unicode character maps for LinkedIn-compatible formatting
const BOLD_MAP = {};
const ITALIC_MAP = {};
const BOLD_ITALIC_MAP = {};

// Build maps: A-Z
for (let i = 0; i < 26; i++) {
  const upper = String.fromCharCode(65 + i);
  const lower = String.fromCharCode(97 + i);
  // Bold: Mathematical Bold (U+1D400)
  BOLD_MAP[upper] = String.fromCodePoint(0x1D400 + i);
  BOLD_MAP[lower] = String.fromCodePoint(0x1D41A + i);
  // Italic: Mathematical Italic (U+1D434)
  ITALIC_MAP[upper] = String.fromCodePoint(0x1D434 + i);
  ITALIC_MAP[lower] = String.fromCodePoint(0x1D44E + i);
  // Bold Italic: Mathematical Bold Italic (U+1D468)
  BOLD_ITALIC_MAP[upper] = String.fromCodePoint(0x1D468 + i);
  BOLD_ITALIC_MAP[lower] = String.fromCodePoint(0x1D482 + i);
}

// Fix italic 'h' (Unicode gap)
ITALIC_MAP['h'] = String.fromCodePoint(0x210E);

// Bold digits: 0-9
for (let i = 0; i < 10; i++) {
  const digit = String.fromCharCode(48 + i);
  BOLD_MAP[digit] = String.fromCodePoint(0x1D7CE + i);
  BOLD_ITALIC_MAP[digit] = String.fromCodePoint(0x1D7CE + i); // no bold-italic digits, use bold
}

function convertText(text, charMap) {
  return [...text].map(ch => charMap[ch] || ch).join('');
}

function stripUnicode(text) {
  // Reverse all unicode formatting back to plain ASCII
  const reverseMaps = [BOLD_MAP, ITALIC_MAP, BOLD_ITALIC_MAP];
  const reverseMap = {};
  for (const map of reverseMaps) {
    for (const [ascii, unicode] of Object.entries(map)) {
      reverseMap[unicode] = ascii;
    }
  }
  return [...text].map(ch => reverseMap[ch] || ch).join('');
}

// DOM elements
const input = document.getElementById('input');
const output = document.getElementById('output');
const charCount = document.getElementById('char-count');
const toast = document.getElementById('toast');

// Toolbar buttons
document.getElementById('btn-bold').addEventListener('click', () => applyFormat(BOLD_MAP));
document.getElementById('btn-italic').addEventListener('click', () => applyFormat(ITALIC_MAP));
document.getElementById('btn-bolditalic').addEventListener('click', () => applyFormat(BOLD_ITALIC_MAP));
document.getElementById('btn-bullet').addEventListener('click', () => insertBullet());
document.getElementById('btn-numbered').addEventListener('click', () => insertNumbered());
document.getElementById('btn-line').addEventListener('click', () => insertAtCursor('\n\n'));
document.getElementById('btn-clear').addEventListener('click', () => clearFormatting());

// Emoji buttons
document.querySelectorAll('.emoji-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    insertAtCursor(btn.dataset.emoji + ' ');
  });
});

// Copy button
document.getElementById('btn-copy').addEventListener('click', copyToClipboard);

// Keyboard shortcuts
input.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'b') { e.preventDefault(); applyFormat(BOLD_MAP); }
    if (e.key === 'i') { e.preventDefault(); applyFormat(ITALIC_MAP); }
  }
});

// Live preview
input.addEventListener('input', updatePreview);

function applyFormat(charMap) {
  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === end) return; // No selection

  const before = input.value.substring(0, start);
  const selected = input.value.substring(start, end);
  const after = input.value.substring(end);

  // Strip any existing unicode formatting first, then apply new
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
    // No selection — insert bullet at cursor
    insertAtCursor('• ');
    return;
  }

  // Selection — add bullet to each line
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
    // Clear all
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

  // Character count (LinkedIn limit: 3000)
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
    showToast('Copied!');
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied!');
  }
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 1500);
}
