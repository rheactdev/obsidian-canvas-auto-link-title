
'use strict';

var obsidian = require('obsidian');

class CanvasAutoLinkPlugin extends obsidian.Plugin {
	async onload() {
		// We use { capture: true } to intercept the paste BEFORE Obsidian's core canvas code gets it
		this.registerDomEvent(document, 'paste', async (evt) => {
			if (evt.defaultPrevented) return;

			var _a;
			const clipboardText = (_a = evt.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text');
			
			// 1. Check if the clipboard is just a standard URL
			if (!clipboardText || !/^https?:\/\/\S+$/.test(clipboardText.trim())) {
				return; // Not a URL, let Obsidian handle it normally
			}

			// 2. Check if the currently active window is a Canvas
			const activeView = this.app.workspace.getActiveViewOfType(obsidian.ItemView);
			if (!activeView || activeView.getViewType() !== 'canvas') {
				return; // Not in a canvas, do nothing
			}

			// Match the native Canvas paste guards and leave unsupported versions alone.
			const canvas = activeView.canvas;
			if (!canvas || canvas.readonly || !canvas.wrapperEl ||
				canvas.canvasEl?.doc?.activeElement !== canvas.wrapperEl ||
				typeof canvas.posCenter !== 'function' ||
				typeof canvas.createTextNode !== 'function' ||
				typeof canvas.requestSave !== 'function') {
				return;
			}

			// Snapshot the native paste position before the title request can delay us.
			const center = canvas.posCenter();
			if (!center || !Number.isFinite(center.x) || !Number.isFinite(center.y)) return;
			const pos = { x: center.x, y: center.y };

			// 3. We are on the editable Canvas background and pasting a URL.
			evt.preventDefault();
			evt.stopPropagation();

			const url = clipboardText.trim();
			new obsidian.Notice("Fetching website title...");

			// 4. Fetch the webpage HTML to scrape the <title> tag
			let title = "Link"; // Fallback title
			try {
				const response = await obsidian.requestUrl({ url: url });
				const html = response.text;
				const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
				if (match && match[1]) {
					// Quick cleanup for common HTML symbols
					title = match[1]
						.replace(/&amp;/g, '&')
						.replace(/&#39;/g, "'")
						.replace(/&quot;/g, '"')
						.trim();
				}
			} catch (e) {
				console.error("Failed to fetch title, using fallback.", e);
				new obsidian.Notice("Couldn't fetch title, using fallback.");
			}

			// 5. Center the text node where Obsidian would have pasted it.
			canvas.createTextNode({
				pos,
				position: 'center',
				text: `[${title}](${url})`,
				size: { width: 300, height: 60 }
			});

			// Tell the canvas to save the new changes
			canvas.requestSave();

		}, { capture: true }); 
	}
}

module.exports = CanvasAutoLinkPlugin;
