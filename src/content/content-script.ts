import { faker, Faker, allFakers } from '@faker-js/faker';
import { Message, FormField, FillOptions } from '@/shared/types';
import { FIELD_PATTERNS } from '@/shared/constants';

// Verify Faker is loaded
console.log('Form Auto-Fill content script loaded');
console.log('Faker library loaded:', !!faker);
console.log('Available locales:', Object.keys(allFakers).length);

// Get Faker instance for a specific locale
function getFakerInstance(locale: string): Faker {
  // Type-safe access to allFakers
  const getLocale = (code: string): Faker | undefined => {
    return (allFakers as any)[code];
  };

  // Map locale code to Faker instance
  const localeMap: Record<string, Faker | undefined> = {
    'en_US': getLocale('en_US'),
    'en_GB': getLocale('en_GB'),
    'en_CA': getLocale('en_CA'),
    'en_AU': getLocale('en_AU'),
    'es': getLocale('es'),
    'es_MX': getLocale('es_MX'),
    'fr': getLocale('fr'),
    'fr_CA': getLocale('fr_CA'),
    'de': getLocale('de'),
    'de_AT': getLocale('de_AT'),
    'de_CH': getLocale('de_CH'),
    'it': getLocale('it'),
    'pt_BR': getLocale('pt_BR'),
    'pt_PT': getLocale('pt_PT'),
    'nl': getLocale('nl'),
    'pl': getLocale('pl'),
    'ru': getLocale('ru'),
    'tr': getLocale('tr'),
    'ja': getLocale('ja'),
    'ko': getLocale('ko'),
    'zh_CN': getLocale('zh_CN'),
    'zh_TW': getLocale('zh_TW'),
    'ar': getLocale('ar'),
    'hi': getLocale('hi_IN'),
    'sv': getLocale('sv'),
    'nb_NO': getLocale('nb_NO'),
    'da': getLocale('da'),
    'fi': getLocale('fi'),
    'cs': getLocale('cs_CZ'),
    'el': getLocale('el'),
    'he': getLocale('he'),
    'id_ID': getLocale('id_ID'),
    'th': getLocale('th'),
    'vi': getLocale('vi'),
    'ro': getLocale('ro'),
    'uk': getLocale('uk'),
  };

  const fakerInstance = localeMap[locale];
  if (fakerInstance) {
    console.log(`Using Faker locale: ${locale}`);
    return fakerInstance;
  }

  console.warn(`Locale ${locale} not found, falling back to en_US`);
  return faker; // fallback to default en_US
}

// Detect all form fields on the page
function detectFormFields(): FormField[] {
  const fields: FormField[] = [];
  const inputs = document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    'input, select, textarea'
  );

  console.log(`🔍 Scanning page for form fields...`);
  console.log(`Found ${inputs.length} total input/select/textarea elements`);

  let skippedCount = 0;

  inputs.forEach((element) => {
    // Skip hidden, submit, button, and reset inputs
    if (
      element instanceof HTMLInputElement &&
      ['hidden', 'submit', 'button', 'reset', 'file', 'image'].includes(element.type)
    ) {
      skippedCount++;
      console.log(`⏭️  Skipped ${element.type} input:`, element.name || element.id || '(no name/id)');
      return;
    }

    const isRequired = element.required;
    const fieldInfo = {
      element,
      type: element instanceof HTMLInputElement ? element.type : element.tagName.toLowerCase(),
      name: element.name || '',
      id: element.id || '',
      placeholder: (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) ? element.placeholder || '' : '',
      required: isRequired,
      pattern: element instanceof HTMLInputElement ? element.pattern : undefined,
      minLength: element instanceof HTMLInputElement ? element.minLength : undefined,
      maxLength: element instanceof HTMLInputElement ? element.maxLength : undefined,
      min: element instanceof HTMLInputElement ? element.min : undefined,
      max: element instanceof HTMLInputElement ? element.max : undefined,
      step: element instanceof HTMLInputElement ? element.step : undefined,
    };

    fields.push(fieldInfo);

    console.log(`${isRequired ? '🔴' : '⚪'} Detected field:`,
      fieldInfo.name || fieldInfo.id || '(no name/id)',
      `[${fieldInfo.type}]`,
      isRequired ? 'REQUIRED' : 'optional'
    );
  });

  console.log(`✅ Total detected: ${fields.length} fields (skipped ${skippedCount})`);
  console.log(`📊 Required: ${fields.filter(f => f.required).length}, Optional: ${fields.filter(f => !f.required).length}`);

  return fields;
}

// Classify field based on attributes
function classifyField(field: FormField): string {
  const searchText = `${field.name} ${field.id} ${field.placeholder}`.toLowerCase();

  for (const [fieldType, pattern] of Object.entries(FIELD_PATTERNS)) {
    if (pattern.test(searchText)) {
      return fieldType;
    }
  }

  return field.type;
}

// Generate random data for a field
function generateData(field: FormField, fakerInstance: Faker = faker): string {
  const fieldType = classifyField(field);

  console.log(`Generating data for field: ${field.name || field.id}, type: ${field.type}, classified as: ${fieldType}`);

  try {
    // Handle specific input types first
    if (field.type === 'email') {
      // Use RFC 2606 reserved domains for safety
      const safeDomains = ['example.com', 'example.net', 'example.org', 'test.com', 'localhost.localdomain'];
      const username = fakerInstance.internet.userName().toLowerCase();
      const domain = fakerInstance.helpers.arrayElement(safeDomains);
      return `${username}@${domain}`;
    }

    if (field.type === 'tel') {
      return fakerInstance.phone.number();
    }

    if (field.type === 'url') {
      return fakerInstance.internet.url();
    }

    if (field.type === 'number') {
      const min = field.min ? parseInt(field.min) : 0;
      const max = field.max ? parseInt(field.max) : 100;
      return fakerInstance.number.int({ min, max }).toString();
    }

    if (field.type === 'date') {
      return fakerInstance.date.between({ from: '1950-01-01', to: '2010-01-01' }).toISOString().split('T')[0];
    }

    if (field.type === 'datetime-local') {
      return fakerInstance.date.recent().toISOString().slice(0, 16);
    }

    if (field.type === 'time') {
      return fakerInstance.date.recent().toTimeString().slice(0, 5);
    }

    if (field.type === 'month') {
      return fakerInstance.date.recent().toISOString().slice(0, 7);
    }

    if (field.type === 'week') {
      const date = fakerInstance.date.recent();
      const year = date.getFullYear();
      const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / 604800000);
      return `${year}-W${week.toString().padStart(2, '0')}`;
    }

    if (field.type === 'color') {
      return fakerInstance.internet.color();
    }

    if (field.type === 'range') {
      const min = field.min ? parseInt(field.min) : 0;
      const max = field.max ? parseInt(field.max) : 100;
      return fakerInstance.number.int({ min, max }).toString();
    }

    // Handle classified field types
    switch (fieldType) {
      case 'email':
        // Use RFC 2606 reserved domains for safety
        const safeDomains = ['example.com', 'example.net', 'example.org', 'test.com', 'localhost.localdomain'];
        const username = fakerInstance.internet.userName().toLowerCase();
        const domain = fakerInstance.helpers.arrayElement(safeDomains);
        return `${username}@${domain}`;

      case 'firstName':
        return fakerInstance.person.firstName();

      case 'lastName':
        return fakerInstance.person.lastName();

      case 'fullName':
        return fakerInstance.person.fullName();

      case 'phone':
        return fakerInstance.phone.number();

      case 'address':
        return fakerInstance.location.streetAddress();

      case 'city':
        return fakerInstance.location.city();

      case 'state':
        return fakerInstance.location.state({ abbreviated: true });

      case 'zip':
        return fakerInstance.location.zipCode();

      case 'country':
        return fakerInstance.location.country();

      case 'company':
        return fakerInstance.company.name();

      case 'username':
        return fakerInstance.internet.userName().toLowerCase();

      case 'password':
        return fakerInstance.internet.password({ length: 12, memorable: false, pattern: /[a-zA-Z0-9]/ });

      case 'url':
        return fakerInstance.internet.url();

      case 'age':
        return fakerInstance.number.int({ min: 18, max: 80 }).toString();

      case 'date':
        return fakerInstance.date.between({ from: '1950-01-01', to: '2010-01-01' }).toISOString().split('T')[0];

      case 'textarea':
        return fakerInstance.lorem.paragraphs(2);

      case 'text':
      default:
        // For generic text, try to be somewhat intelligent
        if (field.maxLength && field.maxLength < 20) {
          return fakerInstance.lorem.word();
        }
        return fakerInstance.person.firstName() + ' ' + fakerInstance.person.lastName();
    }
  } catch (error) {
    console.error('Error generating data with Faker:', error);
    // Fallback to simple random data
    return 'Test Data ' + Math.random().toString(36).substring(7);
  }
}

// Fill form with random data
function fillForm(options?: FillOptions) {
  console.log('=== Form Auto-Fill Started ===');
  console.log('Options received:', options);

  const locale = options?.locale || 'en_US';
  const fillOptionalFields = options?.fillOptionalFields ?? true; // Changed default to true
  const fakerInstance = getFakerInstance(locale);

  console.log(`Using locale: ${locale}`);
  console.log(`Fill optional fields: ${fillOptionalFields}`);

  let fields = detectFormFields();
  console.log(`Found ${fields.length} total form fields`);

  // Filter fields based on fillOptionalFields option
  if (!fillOptionalFields) {
    const originalCount = fields.length;
    const requiredCount = fields.filter(f => f.required).length;
    fields = fields.filter(field => field.required);
    console.log(`Filtering to required fields only: ${fields.length}/${originalCount} fields (${requiredCount} required, ${originalCount - requiredCount} optional)`);

    if (fields.length === 0) {
      console.warn('⚠️ No required fields found! The form has no fields marked with "required" attribute.');
      console.warn('💡 Enable "Fill optional fields" option to fill all fields.');
    }
  } else {
    console.log(`Filling all fields (required + optional)`);
  }

  const processedRadioGroups = new Set<string>();

  fields.forEach((field, index) => {
    try {
      if (field.element instanceof HTMLSelectElement) {
        // For select elements, choose a random option
        const options = Array.from(field.element.options).filter(opt => opt.value && opt.value !== '');
        if (options.length > 0) {
          const randomOption = fakerInstance.helpers.arrayElement(options);
          field.element.value = randomOption.value;
          console.log(`[${index}] Select filled:`, field.name || field.id, '→', randomOption.text);
        }
      } else if (field.element instanceof HTMLInputElement && field.element.type === 'checkbox') {
        field.element.checked = fakerInstance.datatype.boolean();
        console.log(`[${index}] Checkbox filled:`, field.name || field.id, '→', field.element.checked);
      } else if (field.element instanceof HTMLInputElement && field.element.type === 'radio') {
        // Handle radio buttons - only process each group once
        if (!processedRadioGroups.has(field.element.name)) {
          processedRadioGroups.add(field.element.name);
          const radioGroup = document.querySelectorAll<HTMLInputElement>(
            `input[type="radio"][name="${field.element.name}"]`
          );
          if (radioGroup.length > 0) {
            const randomRadio = fakerInstance.helpers.arrayElement(Array.from(radioGroup));
            randomRadio.checked = true;
            console.log(`[${index}] Radio group filled:`, field.element.name, '→', randomRadio.value);
          }
        }
      } else {
        const value = generateData(field, fakerInstance);
        field.element.value = value;
        console.log(`[${index}] Field filled:`, field.name || field.id, `(${field.type})`, '→', value);
      }

      // Trigger change events
      field.element.dispatchEvent(new Event('input', { bubbles: true }));
      field.element.dispatchEvent(new Event('change', { bubbles: true }));
      field.element.dispatchEvent(new Event('blur', { bubbles: true }));

      // Visual feedback
      field.element.style.transition = 'background-color 0.3s';
      field.element.style.backgroundColor = '#d1fae5';
      setTimeout(() => {
        field.element.style.backgroundColor = '';
      }, 1000);
    } catch (error) {
      console.error(`Error filling field ${index}:`, field.name || field.id, error);
    }
  });

  console.log('=== Form Auto-Fill Complete ===');

  // Show alert if no fields were filled
  if (fields.length === 0 && !fillOptionalFields) {
    alert('⚠️ No required fields found!\n\nThis form has no fields marked as "required".\n\n💡 Tip: Enable "Fill optional fields" checkbox in the extension popup to fill all fields.');
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  console.log('Content script received message:', message);

  switch (message.type) {
    case 'FILL_FORM':
      fillForm(message.payload);
      sendResponse({ success: true });
      break;

    case 'GET_FORM_COUNT':
      const fields = detectFormFields();
      sendResponse({ count: fields.length });
      break;

    default:
      break;
  }

  return true;
});
