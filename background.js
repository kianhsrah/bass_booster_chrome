chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateEqualizer') {
      console.log("Received updateEqualizer message in background script");
    }
  });
  