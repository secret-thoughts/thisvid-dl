let latestVideoUrl = null;

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.url.endsWith(".mp4")) {
      latestVideoUrl = details.url;
      chrome.storage.local.set({ latestVideoUrl });
    }
  },
  { urls: ["*://*.thisvid.com/*"], types: ["media"] }
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "download" && msg.url) {
    chrome.downloads.download({ url: msg.url });
  }
});
