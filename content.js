function hookVideo(video) {
  if (video._alreadyHooked) return;
  video._alreadyHooked = true;
  
  video.addEventListener("play", () => {
    setTimeout(() => {
      let mp4Url = video.currentSrc || video.src;
      const sources = [...video.querySelectorAll("source")].map(s => s.src);
      
      if ((!mp4Url || !mp4Url.includes(".mp4")) && sources.length) {
        mp4Url = sources.find(src => src.includes(".mp4"));
      }
      
      if (!mp4Url || !mp4Url.startsWith("http")) {
        console.warn("No valid MP4 URL found.");
        return;
      }
      
      console.log("MP4 URL extracted:", mp4Url);

	const regex = /(\d+\.[a-z0-4]+)/i;
	const match = mp4Url.match(regex);

        let filename = null;
	if (match) {
		filename = match[1];
		console.log("Download filename: ", filename); // Output: 12667273.mp4
	}
      
      if (document.getElementById("thisvid-download-container")) return;
      
      const container = document.createElement("div");
      container.id = "thisvid-download-container";
      container.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 9999 !important;
        background: white;
        border: 2px solid #007bff;
        border-radius: 8px;
        padding: 15px;
        min-width: 250px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      
      const btn = document.createElement("button");
      btn.textContent = "⬇️ Download Video";
      btn.style.cssText = `
        width: 100%;
        padding: 10px;
        background: #007bff;
        color: white;
        border: none;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 10px;
      `;

      const progressContainer = document.createElement("div");
      progressContainer.style.cssText = `
        width: 100%;
        height: 20px;
        background: #f0f0f0;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 5px;
        display: none;
      `;
      
      const progressBar = document.createElement("div");
      progressBar.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #007bff, #0056b3);
        transition: width 0.3s ease;
      `;
      
      const progressText = document.createElement("div");
      progressText.style.cssText = `
        text-align: center;
        font-size: 12px;
        color: #666;
        display: none;
      `;
      
      progressContainer.appendChild(progressBar);
      container.appendChild(btn);
      container.appendChild(progressContainer);
      container.appendChild(progressText);

      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        btn.textContent = "Starting download...";
        btn.disabled = true;
        progressContainer.style.display = "block";
        progressText.style.display = "block";
        
        try {
          const response = await fetch(mp4Url);
          
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const contentLength = response.headers.get('content-length');
          const total = contentLength ? parseInt(contentLength, 10) : null;
          
          let loaded = 0;
          const chunks = [];
          const reader = response.body.getReader();
          
          const startTime = Date.now();
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            chunks.push(value);
            loaded += value.length;
            
            const elapsed = (Date.now() - startTime) / 1000;
            const speed = loaded / elapsed; // bytes per second
            const speedMB = (speed / (1024 * 1024)).toFixed(1);
            
            if (total) {
              const percent = Math.round((loaded / total) * 100);
              const remaining = (total - loaded) / speed;
              const remainingMin = Math.floor(remaining / 60);
              const remainingSec = Math.floor(remaining % 60);
              
              progressBar.style.width = percent + "%";
              progressText.textContent = `${percent}% • ${speedMB} MB/s • ${remainingMin}:${remainingSec.toString().padStart(2, '0')} left`;
              btn.textContent = `Downloading ${percent}%`;
            } else {
              const loadedMB = (loaded / (1024 * 1024)).toFixed(1);
              progressText.textContent = `${loadedMB} MB • ${speedMB} MB/s`;
              btn.textContent = `Downloaded ${loadedMB} MB`;
              // Fake progress when no content-length
              const fakePercent = Math.min(90, (elapsed / 10) * 100);
              progressBar.style.width = fakePercent + "%";
            }
          }
          
          progressBar.style.width = "100%";
          btn.textContent = "Saving file...";
          progressText.textContent = "Creating download...";
          
          const blob = new Blob(chunks, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          btn.textContent = "✅ Downloaded!";
          btn.style.background = "#28a745";
          progressText.textContent = `Complete! ${(blob.size / (1024 * 1024)).toFixed(1)} MB saved as ${filename}`;
          
          setTimeout(() => {
            container.remove();
          }, 3000);
          
        } catch (error) {
          btn.textContent = "Failed";
          btn.style.background = "#dc3545";
          progressText.textContent = "Error: " + error.message;
          console.error("Error:", error);
        }
      };
      
      document.body.appendChild(container);
      
    }, 1500);
  });
}

const observer = new MutationObserver(() => {
  document.querySelectorAll("video").forEach(hookVideo);
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

document.querySelectorAll("video").forEach(hookVideo);
