async function injectDownloadButton() {
  const player = document.querySelector("video");

  if (!player) return;

  // Wait for video URL to become available
  const { latestVideoUrl } = await chrome.storage.local.get("latestVideoUrl");
  if (!latestVideoUrl) return;

  // Prevent duplicate buttons
  if (document.getElementById("thisvid-download-btn")) return;

  const btn = document.createElement("button");
  btn.id = "thisvid-download-btn";
  btn.textContent = "⬇️ Download Video";
  btn.style.cssText = `
    margin-top: 10px;
    padding: 8px 12px;
    background: #007bff;
    color: white;
    border: none;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    display: block;
  `;

  btn.onclick = () => {
    chrome.runtime.sendMessage({ action: "download", url: latestVideoUrl });
  };

  // Append the button under the video player
  player.parentElement.appendChild(btn);
}

// Wait a few seconds to let the video load
setTimeout(injectDownloadButton, 3000);

