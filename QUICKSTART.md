# Quick Start Guide

## Get It Running in 3 Steps

### 1. Install & Build

```bash
yarn install
yarn build
```

### 2. Load in Chrome

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the `dist` folder

### 3. Test It

1. Go to any website with a form (try: https://httpbin.org/forms/post)
2. Click the extension icon
3. Click "Fill Form"
4. Watch the magic happen! ✨

## What You Just Built

- ✅ Chrome Extension (Manifest V3)
- ✅ React + TypeScript + Tailwind CSS
- ✅ Smart form detection
- ✅ Realistic fake data generation
- ✅ Visual feedback on field fill

## Development Mode

For hot reload during development:

```bash
yarn dev
```

Then load/reload the `dist` folder in Chrome extensions page.

## Next Steps

Check out:
- [`README.md`](README.md) - Full documentation
- [`SETUP.md`](SETUP.md) - Detailed setup info
- [`src/content/content-script.ts`](src/content/content-script.ts) - Core form filling logic
- [`src/popup/Popup.tsx`](src/popup/Popup.tsx) - Popup UI

## Test Sites

Try the extension on these sites:
- https://httpbin.org/forms/post
- https://getbootstrap.com/docs/5.3/forms/overview/
- https://www.w3schools.com/html/html_forms.asp
- Any signup/contact form!

---

Happy testing! 🚀
