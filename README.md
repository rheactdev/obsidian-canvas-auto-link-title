# Canvas Paste Link as Text

A lightweight Obsidian plugin that changes how raw URLs are pasted into Obsidian Canvases.

By default, pasting a raw URL onto a Canvas background forces Obsidian to create an embedded web page (iframe). This plugin intercepts the paste, fetches the webpage's title in the background, and drops a clean, formatted Markdown link `[Title](URL)` into a standard text node instead.

## ✨ Features
* **Bypasses Canvas Embeds:** Stops Obsidian from automatically creating iframe cards when pasting URLs.
* **Auto-Fetches Titles:** Reaches out to the pasted URL and scrapes the HTML `<title>` tag so you don't have to type it manually.
* **Instant Text Nodes:** Automatically spawns a text node right at your mouse cursor containing your formatted Markdown link.

## 🚀 Usage
1. Copy any standard URL from your browser (e.g., `https://obsidian.md`).
2. Open an Obsidian Canvas.
3. Paste (`Ctrl+V` or `Cmd+V`) directly onto the empty Canvas background.
4. The plugin will display a "Fetching website title..." notice and instantly create your text node.

## 🛠️ Manual Installation
1. Open your Obsidian vault folder on your computer.
2. Navigate to the hidden plugins directory: `.obsidian/plugins/`.
3. Create a new folder named `canvas-paste-link`.
4. Place the `main.js` and `manifest.json` files into this new folder.
5. Restart Obsidian (or reload your vault).
6. Go to **Settings > Community Plugins**, find **Canvas Paste Link as Text**, and toggle it on.

## ⚠️ Notes & Limitations
* **Canvas API:** This plugin relies on Obsidian's internal/undocumented Canvas API (`canvas.createTextNode`). If Obsidian pushes a major update to how Canvas works under the hood, this plugin may need a code tweak.
* **CORS / Fetching:** Some websites block external title fetching. If the plugin cannot scrape the title, it will gracefully fall back to naming the link `[Link](URL)`.