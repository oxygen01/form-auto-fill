# Localization Feature Guide

## Overview

The Form Auto-Fill extension now supports **36 different locales** to generate location-specific data including addresses, phone numbers, names, and more!

## How to Use

### 1. Reload the Extension

After building, reload the extension in Chrome:
```bash
yarn build
```

Then go to `chrome://extensions/` and click the reload icon.

### 2. Select Your Locale

1. Click the extension icon
2. Find the **"Locale"** dropdown in Quick Settings
3. Choose your preferred locale (e.g., 🇩🇪 German, 🇯🇵 Japanese, 🇫🇷 French)
4. The selection is saved automatically

### 3. Fill Forms

Click "Fill Form" - all data will now be generated using your selected locale!

## Supported Locales (36 Total)

### 🌎 Americas
- 🇺🇸 **English (US)** - Default
- 🇬🇧 **English (UK)**
- 🇨🇦 **English (Canada)** & **French (Canada)**
- 🇦🇺 **English (Australia)**
- 🇲🇽 **Spanish (Mexico)**
- 🇪🇸 **Spanish**
- 🇧🇷 **Portuguese (Brazil)**
- 🇵🇹 **Portuguese (Portugal)**

### 🌍 Europe
- 🇩🇪 **German**
- 🇦🇹 **German (Austria)**
- 🇨🇭 **German (Switzerland)**
- 🇫🇷 **French**
- 🇮🇹 **Italian**
- 🇳🇱 **Dutch**
- 🇵🇱 **Polish**
- 🇷🇺 **Russian**
- 🇹🇷 **Turkish**
- 🇸🇪 **Swedish**
- 🇳🇴 **Norwegian**
- 🇩🇰 **Danish**
- 🇫🇮 **Finnish**
- 🇨🇿 **Czech**
- 🇬🇷 **Greek**
- 🇷🇴 **Romanian**
- 🇺🇦 **Ukrainian**

### 🌏 Asia & Middle East
- 🇯🇵 **Japanese**
- 🇰🇷 **Korean**
- 🇨🇳 **Chinese (Simplified)**
- 🇹🇼 **Chinese (Traditional)**
- 🇸🇦 **Arabic**
- 🇮🇳 **Hindi**
- 🇮🇱 **Hebrew**
- 🇮🇩 **Indonesian**
- 🇹🇭 **Thai**
- 🇻🇳 **Vietnamese**

## Example Output by Locale

### 🇺🇸 English (US)
```
Name: Sarah Johnson
Address: 1234 Oak Street
City: San Francisco
State: CA
Zip: 94102
Phone: (555) 123-4567
Email: sarah.johnson@example.com
```

### 🇩🇪 German
```
Name: Hans Müller
Address: Hauptstraße 123
City: Berlin
Zip: 10115
Phone: +49 30 12345678
Email: hans.mueller@example.com
```

### 🇯🇵 Japanese
```
Name: 田中太郎
Address: 東京都渋谷区1-2-3
City: 東京
Zip: 150-0001
Phone: 090-1234-5678
Email: tanaka.taro@example.com
```

### 🇫🇷 French
```
Name: Marie Dubois
Address: 123 Rue de la Paix
City: Paris
Zip: 75001
Phone: 01 23 45 67 89
Email: marie.dubois@example.com
```

### 🇪🇸 Spanish
```
Name: María García
Address: Calle Mayor 123
City: Madrid
Zip: 28013
Phone: 912 345 678
Email: maria.garcia@example.com
```

### 🇧🇷 Portuguese (Brazil)
```
Name: João Silva
Address: Rua das Flores 123
City: São Paulo
Zip: 01234-567
Phone: (11) 91234-5678
Email: joao.silva@example.com
```

### 🇷🇺 Russian
```
Name: Иван Петров
Address: улица Ленина 123
City: Москва
Zip: 123456
Phone: +7 495 123-45-67
Email: ivan.petrov@example.com
```

### 🇨🇳 Chinese (Simplified)
```
Name: 王伟
Address: 人民路123号
City: 北京
Zip: 100000
Phone: 138 1234 5678
Email: wang.wei@example.com
```

### 🇰🇷 Korean
```
Name: 김민수
Address: 강남대로 123
City: 서울
Zip: 06000
Phone: 010-1234-5678
Email: kim.minsu@example.com
```

## What Gets Localized?

### ✅ Locale-Specific Data
- **Names**: First names, last names, full names appropriate to the locale
- **Addresses**: Street addresses in local format
- **Cities**: Real cities from that country
- **States/Provinces**: Appropriate to the country (if applicable)
- **Zip/Postal Codes**: Proper format for that locale
- **Phone Numbers**: Local phone number formats
- **Company Names**: Realistic company names for that locale

### ⚠️ Always English
Some fields remain in English across all locales:
- **Email addresses**: Always use Latin characters
- **Usernames**: Always use Latin characters
- **URLs**: Always use standard URL format
- **Passwords**: Always use alphanumeric characters

## Technical Details

### How It Works

1. **User selects locale** in the popup
2. **Locale is saved** to Chrome storage
3. **On form fill**, the locale is passed to the content script
4. **Faker.js instance** is created for that specific locale
5. **All data** is generated using the locale-specific Faker instance

### Code Changes

**Files Modified:**
- [`src/shared/constants.ts`](src/shared/constants.ts#L12-L49) - Added `SUPPORTED_LOCALES` array
- [`src/content/content-script.ts`](src/content/content-script.ts#L1-L65) - Added `getFakerInstance()` function
- [`src/content/content-script.ts`](src/content/content-script.ts#L238-L243) - Updated `fillForm()` to accept locale
- [`src/popup/Popup.tsx`](src/popup/Popup.tsx#L106-L122) - Added locale dropdown

### Fallback Behavior

If a locale is not found or unsupported:
- Extension falls back to **English (US)**
- A warning is logged to the console
- Form filling continues normally

## Testing Different Locales

### Quick Test

1. **Select locale**: Choose "🇩🇪 German" from dropdown
2. **Go to test form**: https://httpbin.org/forms/post
3. **Click "Fill Form"**
4. **Observe**: Names like "Hans" or "Greta", German city names, German phone formats

### Console Debugging

Open browser console (F12) to see:
```
Using Faker locale: de
[0] Field filled: name (text) → Hans Müller
[1] Field filled: address (text) → Hauptstraße 123
[2] Field filled: city (text) → Berlin
```

## Locale Coverage

Not all locales have complete data for all fields. Faker.js uses a fallback system:

- **Full Coverage**: en_US, de, fr, es, pt_BR, ja, zh_CN
- **Good Coverage**: Most European languages
- **Partial Coverage**: Some locales may fall back to English for certain fields (e.g., company names)

This is a limitation of the Faker.js library itself, not the extension.

## Use Cases

### 🌍 International Testing
Test forms for different countries:
- E-commerce checkout flows
- International shipping forms
- Multi-language signup pages

### 🗣️ Language-Specific Forms
Test forms that expect specific languages:
- Japanese Kanji/Hiragana
- Cyrillic characters (Russian)
- Arabic right-to-left text
- Chinese characters

### 📍 Address Validation
Test address validators for different formats:
- US: ZIP code + State
- UK: Postcode
- Germany: PLZ
- Japan: Prefecture + City

### 📞 Phone Formats
Test different phone number formats:
- US: (555) 123-4567
- UK: +44 20 1234 5678
- France: 01 23 45 67 89
- Japan: 090-1234-5678

## Tips

1. **Realistic Data**: Select the locale matching the form's target country for most realistic test data
2. **Multi-Language Sites**: Switch locales when testing different language versions of a site
3. **Validation Testing**: Use different locales to test international character support
4. **Performance**: No performance difference between locales - all are equally fast

## Future Enhancements

Potential future improvements:
- [ ] Auto-detect form language and suggest locale
- [ ] Custom locale mappings per website
- [ ] Locale-specific field patterns (e.g., German "Straße" detection)
- [ ] Mixed locale support (e.g., English name with Japanese address)

---

**Ready to test?** Reload the extension and try different locales! 🌍
