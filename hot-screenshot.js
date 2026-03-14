// Screenshot capture system for gameplay observation
window.HOT_SCREENSHOT = (() => {
    let captureInterval = null;
    let captureCount = 0;
    const screenshots = [];
    
    function captureScreenshot() {
        html2canvas(document.body, {
            logging: false,
            backgroundColor: '#1a1a1a'
        }).then(canvas => {
            const timestamp = new Date().toISOString();
            const dataUrl = canvas.toDataURL('image/png');
            
            screenshots.push({
                timestamp,
                dataUrl,
                gameState: {
                    year: window.HOT_STATE?.gameState?.year || 0,
                    marks: window.HOT_STATE?.gameState?.marks || 0,
                    ships: window.HOT_STATE?.gameState?.ships || 0,
                    reputation: window.HOT_STATE?.gameState?.reputation || 0,
                    phase: window.HOT_STATE?.gameState?.phase || 'unknown',
                    currentEvent: document.querySelector('#event-text')?.innerText?.substring(0, 100) || ''
                }
            });
            
            // Keep only last 20 screenshots in memory
            if (screenshots.length > 20) {
                screenshots.shift();
            }
            
            captureCount++;
            updateCaptureIndicator();
            
            // Auto-save screenshot to file for Claude to read
            if (captureCount % 5 === 0) { // Every 5th capture
                saveScreenshotToFile(dataUrl, timestamp);
            }
        });
    }
    
    function saveScreenshotToFile(dataUrl, timestamp) {
        const link = document.createElement('a');
        link.download = `hot-gameplay-${timestamp.replace(/[:.]/g, '-')}.png`;
        link.href = dataUrl;
        
        // Create a temporary directory path for auto-saving
        const tempPath = `/tmp/hot-screenshots/latest-gameplay.png`;
        
        // For now, we'll just update the latest screenshot in memory
        window.HOT_LATEST_SCREENSHOT = dataUrl;
        
        console.log(`Screenshot captured at ${timestamp}`);
    }
    
    function startCapture(intervalSeconds = 10) {
        if (captureInterval) return;
        
        console.log(`Starting screenshot capture every ${intervalSeconds} seconds`);
        captureScreenshot(); // Capture immediately
        captureInterval = setInterval(captureScreenshot, intervalSeconds * 1000);
        
        addCaptureIndicator();
    }
    
    function stopCapture() {
        if (captureInterval) {
            clearInterval(captureInterval);
            captureInterval = null;
            console.log('Screenshot capture stopped');
            removeCaptureIndicator();
        }
    }
    
    function addCaptureIndicator() {
        if (document.querySelector('#capture-indicator')) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'capture-indicator';
        indicator.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; background: rgba(255,0,0,0.8); 
                        color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; 
                        z-index: 10000; display: flex; align-items: center; gap: 10px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: white; 
                            border-radius: 50%; animation: pulse 2s infinite;"></span>
                <span>Recording (${captureCount} captures)</span>
                <button onclick="window.HOT_SCREENSHOT.stopCapture()" 
                        style="background: white; color: red; border: none; padding: 2px 8px; 
                               border-radius: 3px; cursor: pointer; font-size: 11px;">
                    Stop
                </button>
            </div>
            <style>
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(indicator);
    }
    
    function updateCaptureIndicator() {
        const indicator = document.querySelector('#capture-indicator span:nth-child(2)');
        if (indicator) {
            indicator.textContent = `Recording (${captureCount} captures)`;
        }
    }
    
    function removeCaptureIndicator() {
        const indicator = document.querySelector('#capture-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    function getLatestScreenshot() {
        return screenshots[screenshots.length - 1];
    }
    
    function getAllScreenshots() {
        return screenshots;
    }
    
    // Add keyboard shortcut for quick capture
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            if (captureInterval) {
                stopCapture();
            } else {
                startCapture(5); // Capture every 5 seconds
            }
        }
    });
    
    return {
        startCapture,
        stopCapture,
        captureScreenshot,
        getLatestScreenshot,
        getAllScreenshots,
        isCapturing: () => !!captureInterval
    };
})();