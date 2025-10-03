# Form Auto-Fill Chrome Extension

A Chrome extension that intelligently auto-fills forms with random, realistic data for testing purposes.

## Features

✅ **Smart Form Detection**
- Automatically detects all form inputs on any webpage
- Identifies input types (text, email, number, tel, url, date, etc.)
- Recognizes field patterns via name, ID, placeholder attributes

✅ **Intelligent Data Generation**
- Generates contextually appropriate random data using Faker.js
- Email → valid email addresses
- Names → realistic first/last/full names
- Phone → phone numbers
- Address → street, city, state, zip, country
- Numbers → respects min/max/step validation
- Dates → valid date formats
- And more!

✅ **HTML5 Validation Support**
- Respects `required`, `pattern`, `minlength`, `maxlength` attributes
- Honors `min`, `max`, `step` for number inputs
- Handles all input types correctly

✅ **Multiple Input Types**
- Text inputs
- Email, URL, Tel, Number, Date, Time
- Select dropdowns (random selection)
- Radio buttons (random selection)
- Checkboxes (random checked state)
- Textareas (paragraph text)

✅ **Visual Feedback**
- Green highlight animation on filled fields
- Shows field count in popup
- Loading state during fill operation

✅ **Localization Support** 🌍
- **36 locales** supported (English, German, French, Japanese, Chinese, Arabic, and more!)
- Generate locale-specific names, addresses, cities, and phone numbers
- Easy locale switching via dropdown
- Perfect for testing international forms
- See [LOCALIZATION.md](LOCALIZATION.md) for details

## Installation

### Development Mode

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Build the extension**:
   ```bash
   yarn build
   ```

3. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Development with Hot Reload

```bash
yarn dev
```

Then load the `dist` folder in Chrome as described above. Changes will rebuild automatically.

## Usage

1. **Navigate to any webpage with a form** (signup pages, contact forms, etc.)

2. **Click the extension icon** in the Chrome toolbar

3. **View detected fields** - The popup shows how many form fields were detected

4. **Click "Fill Form"** - All fields will be filled with random, contextually appropriate data

5. **Visual confirmation** - Filled fields will briefly highlight in green

## Tech Stack

- **TypeScript** - Type-safe development
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **CRXJS** - Chrome extension bundler
- **Tailwind CSS** - Utility-first styling
- **Faker.js** - Realistic fake data generation
- **Zustand** - State management
- **Chrome Manifest V3** - Latest extension standard

## Project Structure

```
form-auto-fill/
├── src/
│   ├── background/
│   │   └── service-worker.ts      # Background service worker
│   ├── content/
│   │   └── content-script.ts      # Form detection & filling logic
│   ├── popup/
│   │   ├── Popup.tsx              # Popup UI component
│   │   └── index.tsx              # Popup entry point
│   ├── shared/
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── constants.ts           # Field patterns & constants
│   │   └── storage.ts             # Chrome storage wrapper
│   ├── styles/
│   │   └── globals.css            # Global styles
│   └── manifest.json              # Extension manifest
├── public/                         # Static assets
├── dist/                           # Built extension (generated)
└── package.json
```

## Available Scripts

```bash
# Development with hot reload
yarn dev

# Production build
yarn build

# Type checking
yarn type-check

# Preview production build
yarn preview
```

## Field Detection Patterns

The extension recognizes common field patterns:

| Pattern | Fields Matched |
|---------|----------------|
| Email | `email`, `e-mail`, `correo` |
| First Name | `firstName`, `fname`, `given-name` |
| Last Name | `lastName`, `lname`, `surname` |
| Phone | `phone`, `tel`, `mobile`, `celular` |
| Address | `address`, `street`, `direccion` |
| City | `city`, `ciudad` |
| State | `state`, `province`, `provincia` |
| Zip | `zip`, `postal`, `codigo-postal` |
| Country | `country`, `pais` |
| Company | `company`, `organization` |
| Username | `username`, `login` |
| Password | `password`, `passwd` |
| URL | `website`, `url`, `site` |
| Age | `age`, `edad` |
| Date | `date`, `fecha` |

## Settings

- **Respect field validation** - Toggle to honor/ignore HTML5 validation attributes

## Known Limitations

- Icons are currently placeholders (simple blue squares)
- Content script bundle is large (~2.5MB) due to Faker.js inclusion
- Some dynamic/JavaScript-rendered forms may need a page refresh

## Future Enhancements

- [ ] Add proper extension icons
- [ ] Optimize bundle size (code splitting for Faker.js)
- [ ] Advanced settings page
- [ ] Save/load user profiles
- [ ] Locale selection for different regions
- [ ] Keyboard shortcuts (e.g., Ctrl+Shift+F)
- [ ] Context menu integration
- [ ] Animation speed options
- [ ] Field exclusion rules
- [ ] Export/import configurations
- [ ] Per-website custom rules

## Troubleshooting

### Extension won't load
- Ensure you ran `yarn build` first
- Check that the `dist` folder exists
- Look for errors in Chrome's extension management page

### Content script not working
- Refresh the webpage after loading the extension
- Check browser console for errors (F12)
- Verify the page has actual form fields
- Won't work on chrome:// pages (Chrome restriction)

### No fields detected
- The page might load forms dynamically - try refreshing
- Check that form elements are standard HTML inputs
- Some sites use non-standard form implementations

## Development Notes

### Adding New Field Patterns

Edit [`src/shared/constants.ts`](src/shared/constants.ts):

```typescript
export const FIELD_PATTERNS = {
  // Add new pattern
  customField: /custom|field|pattern/i,
  // ...
}
```

Then handle it in [`src/content/content-script.ts`](src/content/content-script.ts):

```typescript
function generateData(field: FormField): string {
  const fieldType = classifyField(field);

  switch (fieldType) {
    case 'customField':
      return faker.custom.method();
    // ...
  }
}
```

### Modifying the UI

The popup UI is in [`src/popup/Popup.tsx`](src/popup/Popup.tsx). It uses React and Tailwind CSS.

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

---

**Note**: This extension is for testing and development purposes only. Do not use it to submit real forms with fake data.
