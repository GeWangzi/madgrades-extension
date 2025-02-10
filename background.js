chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url) {
        chrome.storage.local.set({ currentUrl: tab.url });
    }
});