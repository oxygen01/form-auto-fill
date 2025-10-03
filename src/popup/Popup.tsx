import { useState, useEffect } from 'react';
import { Wand2, Settings, RefreshCw, Globe } from 'lucide-react';
import { storage } from '@/shared/storage';
import { FillOptions } from '@/shared/types';
import { SUPPORTED_LOCALES } from '@/shared/constants';

function Popup() {
  const [options, setOptions] = useState<FillOptions | null>(null);
  const [fieldCount, setFieldCount] = useState<number>(0);
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    // Load options
    storage.getOptions().then(setOptions);

    // Get form field count from active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'GET_FORM_COUNT' },
          (response) => {
            if (response?.count !== undefined) {
              setFieldCount(response.count);
            }
          }
        );
      }
    });
  }, []);

  const handleFillForm = async () => {
    setFilling(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'FILL_FORM', payload: options },
          () => {
            setTimeout(() => {
              setFilling(false);
            }, 500);
          }
        );
      }
    });
  };

  const toggleValidation = async () => {
    if (!options) return;
    const newOptions = { ...options, respectValidation: !options.respectValidation };
    setOptions(newOptions);
    await storage.setOptions(newOptions);
  };

  const handleLocaleChange = async (newLocale: string) => {
    if (!options) return;
    const newOptions = { ...options, locale: newLocale };
    setOptions(newOptions);
    await storage.setOptions(newOptions);
  };

  const toggleOptionalFields = async () => {
    if (!options) return;
    const newOptions = { ...options, fillOptionalFields: !options.fillOptionalFields };
    setOptions(newOptions);
    await storage.setOptions(newOptions);
  };

  if (!options) {
    return (
      <div className="w-80 h-96 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-80 bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
        <div className="flex items-center gap-2">
          <Wand2 className="w-6 h-6" />
          <h1 className="text-lg font-semibold">Form Auto-Fill</h1>
        </div>
        <p className="text-sm text-blue-100 mt-1">
          {fieldCount > 0 ? `${fieldCount} fields detected` : 'No form fields detected'}
        </p>
      </div>

      <div className="p-4 space-y-4">
        <button
          onClick={handleFillForm}
          disabled={fieldCount === 0 || filling}
          className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {filling ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Filling...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Fill Form
            </>
          )}
        </button>

        <div className="border-t pt-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Quick Settings</h2>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Globe className="w-4 h-4" />
              Locale
            </label>
            <select
              value={options.locale}
              onChange={(e) => handleLocaleChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SUPPORTED_LOCALES.map((locale) => (
                <option key={locale.code} value={locale.code}>
                  {locale.flag} {locale.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.fillOptionalFields}
              onChange={toggleOptionalFields}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Fill optional fields</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.respectValidation}
              onChange={toggleValidation}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Respect field validation</span>
          </label>
        </div>

        <div className="border-t pt-4">
          <button className="w-full btn btn-secondary flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Advanced Settings
          </button>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 text-xs text-gray-500 text-center border-t">
        Press the button to fill detected form fields with random data
      </div>
    </div>
  );
}

export default Popup;
