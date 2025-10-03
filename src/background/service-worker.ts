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

// Extension installed/updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Form Auto-Fill extension installed');
});
