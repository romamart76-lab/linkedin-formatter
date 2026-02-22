# LinkedIn Post Formatter — Chrome Extension

Format your LinkedIn posts with **bold**, *italic*, bullets, and emojis. Uses Unicode characters that work natively on LinkedIn — no markdown, no hacks.

## Features

- **Bold / Italic / Bold-Italic** via Unicode math symbols
- **Bullet points** and **numbered lists**
- **Emoji quick-insert** bar
- **Character counter** (LinkedIn limit: 3,000)
- **Keyboard shortcuts** (Ctrl+B, Ctrl+I)
- **Zero permissions** — no data leaves your browser
- **No account needed**

## Install (Developer Mode)

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked**
4. Select this folder (`linkedin-formatter/`)
5. Pin the extension (puzzle icon 🧩 → pin)

## How to Use

1. Click the extension icon in toolbar
2. Type or paste your post text
3. Select text → click **B** (bold), **I** (italic), etc.
4. Click emojis to insert them
5. Hit **Copy to Clipboard**
6. Paste into LinkedIn

## How It Works

LinkedIn doesn't support markdown or rich text in post composer. But it does render Unicode mathematical symbols — so `Hello` becomes `𝐇𝐞𝐥𝐥𝐨` (bold) or `𝘏𝘦𝘭𝘭𝘰` (italic). This extension converts selected text to those Unicode characters.

## Privacy

- Zero permissions required
- No external connections
- No analytics or tracking
- No data storage — everything stays in memory

## License

MIT
