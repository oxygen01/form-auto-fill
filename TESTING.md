# Testing the Form Auto-Fill Extension

## Reload the Extension

After rebuilding, you need to reload the extension in Chrome:

1. Go to `chrome://extensions/`
2. Find "Form Auto-Fill" extension
3. Click the **reload icon** (circular arrow)
4. Or toggle it off and on

## Test Forms

### Quick Test Site
Try this simple form: https://httpbin.org/forms/post

### What You Should See Now

The extension now generates **realistic, contextual data** using Faker.js:

#### Email Fields
- ✅ **Before**: Random strings like "xyz123"
- ✅ **Now**: Valid emails like "john.doe@example.com"

#### Phone Fields
- ✅ **Before**: Random text
- ✅ **Now**: Formatted numbers like "(555) 123-4567"

#### Name Fields
- ✅ **Before**: Random strings
- ✅ **Now**: Real names like:
  - First Name: "Sarah"
  - Last Name: "Johnson"
  - Full Name: "Michael Anderson"

#### Address Fields
- ✅ **Before**: Random text
- ✅ **Now**: Real addresses:
  - Address: "1234 Oak Street"
  - City: "San Francisco"
  - State: "CA"
  - Zip: "94102"
  - Country: "United States"

#### Other Fields
- Username: "sarah_jones"
- Company: "Tech Solutions Inc"
- URL: "https://example.com"
- Age: "32"
- Date: "1985-06-15"
- Password: "aB3xK9mP2qR7"

## Debugging

### Check Console Logs

Open the browser console (F12) while on a page with forms. You should see:

```
Form Auto-Fill content script loaded
Faker library loaded: true
```

When you click "Fill Form", you'll see:

```
=== Form Auto-Fill Started ===
Found 8 form fields
Generating data for field: email, type: email, classified as: email
[0] Field filled: email (email) → john.doe@example.com
Generating data for field: firstName, type: text, classified as: firstName
[1] Field filled: firstName (text) → Sarah
...
=== Form Auto-Fill Complete ===
```

### Common Issues

**Issue**: Still seeing random strings
- **Fix**: Make sure you reloaded the extension after building
- Check that `dist/assets/content-script.ts-*.js` file was updated (check file timestamp)

**Issue**: No console logs
- **Fix**: Refresh the webpage after reloading the extension

**Issue**: Faker not generating data
- **Fix**: Check browser console for errors
- The extension includes a fallback to simple random data if Faker fails

## Field Type Coverage

The extension now handles:

### Input Types
- ✅ `type="text"` → Names or generic text
- ✅ `type="email"` → Valid email addresses
- ✅ `type="tel"` → Phone numbers (###-###-####)
- ✅ `type="number"` → Numbers respecting min/max
- ✅ `type="url"` → Valid URLs
- ✅ `type="date"` → Valid dates (YYYY-MM-DD)
- ✅ `type="datetime-local"` → Datetime strings
- ✅ `type="time"` → Time values (HH:MM)
- ✅ `type="month"` → Month values
- ✅ `type="week"` → Week values
- ✅ `type="color"` → Color hex codes
- ✅ `type="range"` → Values within range
- ✅ `type="password"` → Strong passwords
- ✅ `type="checkbox"` → Random checked state
- ✅ `type="radio"` → Random selection

### Other Elements
- ✅ `<select>` → Random option selection
- ✅ `<textarea>` → Paragraph text

### Smart Pattern Matching

The extension recognizes field names/IDs/placeholders:

| Pattern | Example Names | Generated Data |
|---------|---------------|----------------|
| Email | `email`, `e-mail`, `correo` | john.doe@email.com |
| First Name | `firstName`, `fname`, `given-name` | Sarah |
| Last Name | `lastName`, `lname`, `surname` | Johnson |
| Full Name | `name`, `fullName` | Michael Anderson |
| Phone | `phone`, `tel`, `mobile` | (555) 123-4567 |
| Address | `address`, `street` | 1234 Oak Street |
| City | `city`, `ciudad` | San Francisco |
| State | `state`, `province` | CA |
| Zip | `zip`, `postal` | 94102 |
| Country | `country`, `pais` | United States |
| Company | `company`, `organization` | Tech Solutions Inc |
| Username | `username`, `login` | sarah_jones |
| Password | `password`, `passwd` | aB3xK9mP2qR7 |
| URL | `website`, `url`, `site` | https://example.com |
| Age | `age`, `edad` | 32 |

## Test Different Forms

### Bootstrap Forms
https://getbootstrap.com/docs/5.3/forms/overview/

### HTML Form Examples
https://www.w3schools.com/html/html_forms.asp

### Real-World Forms
- Contact forms
- Signup forms
- Checkout forms
- Survey forms

## Expected Behavior

1. **Click extension icon** → Shows field count
2. **Click "Fill Form"** → All fields fill instantly
3. **Fields highlight green** → Visual confirmation
4. **Check console** → Detailed logs of what was filled
5. **Realistic data** → Names are names, emails are valid, phones are formatted

## Success Criteria

✅ Email fields contain valid email addresses
✅ Phone fields contain formatted phone numbers
✅ Name fields contain realistic human names
✅ Address fields contain real-looking addresses
✅ All fields are filled (no empty fields)
✅ Green highlight animation works
✅ Console shows detailed fill logs

If all above are working, the extension is functioning correctly! 🎉

## Performance Note

The content script is large (~2.5MB) because Faker.js is included. This is normal and doesn't affect performance significantly. The data generation is instant.

---

Ready to test? Reload the extension and try it on any form!
