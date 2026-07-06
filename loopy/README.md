# ↻ Loopy — One-Click Better AI Answers

**One click makes ChatGPT or Claude critique and improve its own answer, so you get its best work every time.**

Most people type a quick question and accept the first, mediocre reply. Loopy
adds a button to your chat that automatically runs a *self-improvement loop* —
the AI reviews its own answer, finds the weaknesses, and rewrites it, one or
more times. No prompting skill required.

- 🔒 **Private** — runs inside your own ChatGPT / Claude session. No API keys, no accounts, nothing leaves your browser.
- 🆓 **$0 to run** — Loopy never calls any AI itself; it just drives *your* chat.
- ⚡ **One click** — no setup, no CLAUDE.md, no plugins.

Works on **ChatGPT** (chatgpt.com) and **Claude** (claude.ai).

---

## Try it now (load unpacked — takes 1 minute)

1. Open **chrome://extensions** in Chrome (or any Chromium browser).
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this `loopy/` folder.
4. Open **chatgpt.com** or **claude.ai**, ask anything, and wait for the answer.
5. Click the purple **↻ Loopy** button (bottom-right). Watch it improve the answer.
6. Click the toolbar icon to change how many improvement passes it runs (1–5) or edit the instruction.

## How it works

After the AI answers, Loopy sends a follow-up asking it to critique and rewrite
its own reply — the "Self-Refine" technique that research shows improves answer
quality by ~20%. It repeats this for the number of passes you set.

Each pass uses one message in your chat (so on a free plan, heavy looping can
hit your usage limit — that's expected).

## ⚠️ Known limitation (v0.1)

ChatGPT and Claude change their page HTML often. If the button stops sending or
can't find the message box, the CSS selectors need updating — they're all
grouped in the `ADAPTERS` object at the top of `content.js` for easy fixing.

## Roadmap

- [ ] Verify + tune selectors against the live sites
- [ ] "Improve once" vs "keep improving until good" modes
- [ ] Gemini + Perplexity support
- [ ] Freemium: free 1 pass, Pro unlocks multi-pass + custom loops (via ExtensionPay)
- [ ] Publish to the Chrome Web Store
