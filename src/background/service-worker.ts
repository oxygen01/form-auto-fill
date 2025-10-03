import { Message } from '@/shared/types';

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message: Message, _sender, _sendResponse) => {
  console.log('Background received message:', message);

  switch (message.type) {
    case 'FILL_FORM':
      // Forward message to active tab's content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, message);
        }
      });
      break;

    default:
      break;
  }

  return true;
});

// Create context menu on startup
function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'fill-form',
      title: 'Fill Form',
      contexts: ['page', 'editable']
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error creating context menu:', chrome.runtime.lastError);
      } else {
        console.log('✅ Context menu created');
      }
    });
  });
}

// Extension installed/updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Form Auto-Fill extension installed');
  createContextMenu();
});

// Also create on startup (in case service worker restarts)
chrome.runtime.onStartup.addListener(() => {
  console.log('Form Auto-Fill extension started');
  createContextMenu();
});

// Create immediately when service worker loads
createContextMenu();

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'fill-form' && tab?.id) {
    // Get current options from storage and send fill command
    chrome.storage.sync.get('options', (result) => {
      const options = result.options || {
        respectValidation: true,
        fillOptionalFields: true,
        locale: 'en_US',
        animationSpeed: 'fast'
      };

      chrome.tabs.sendMessage(tab.id!, {
        type: 'FILL_FORM',
        payload: options
      });
    });
  }
});
