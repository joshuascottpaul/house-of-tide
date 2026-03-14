// Live screenshot capture system with automatic file export
window.HOT_SCREENSHOT_LIVE = (() => {
    let captureInterval = null;
    let captureCount = 0;
    let fileHandle = null;
    
    async function initFileAccess() {
        try {
            // Request file system access
            const opts = {
                suggestedName: 'hot-gameplay-live.png',
                types: [{
                    description: 'PNG Image',
                    accept: {'image/png': ['.png']}
                }]
            };
            
            fileHandle = await window.showSaveFilePicker(opts);
            console.log('File access granted for live screenshots');
            return true;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('User cancelled file picker');
            } else {
                console.error('File access error:', err);
            }
            return false;
        }
    }
    
    async function captureAndSave() {
        try {
            const canvas = await html2canvas(document.body, {
                logging: false,
                backgroundColor: '#1a1a1a',
                scale: 1
            });
            
            // Convert to blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            
            // Add metadata to image
            const metadata = {
                timestamp: new Date().toISOString(),
                year: window.HOT_STATE?.gameState?.year || 0,
                marks: window.HOT_STATE?.gameState?.marks || 0,
                ships: window.HOT_STATE?.gameState?.ships || 0,
                reputation: window.HOT_STATE?.gameState?.reputation || 0,
                phase: window.HOT_STATE?.gameState?.phase || 'unknown',
                currentEvent: document.querySelector('#event-text')?.innerText?.substring(0, 200) || ''
            };
            
            // Write to file
            if (fileHandle) {
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
                
                // Also save metadata as JSON
                await saveMetadata(metadata);
            }
            
            captureCount++;
            updateCaptureIndicator();
            
        } catch (err) {
            console.error('Capture error:', err);
        }
    }
    
    async function saveMetadata(metadata) {
        try {
            // Save metadata to localStorage for easy access
            localStorage.setItem('hot-live-screenshot-metadata', JSON.stringify(metadata));
            
            // Also try to save as companion JSON file
            const jsonOpts = {
                suggestedName: 'hot-gameplay-metadata.json',
                types: [{
                    description: 'JSON File',
                    accept: {'application/json': ['.json']}
                }]
            };
            
            // Only prompt once for metadata file
            if (!window.HOT_METADATA_HANDLE) {
                window.HOT_METADATA_HANDLE = await window.showSaveFilePicker(jsonOpts);
            }
            
            if (window.HOT_METADATA_HANDLE) {
                const writable = await window.HOT_METADATA_HANDLE.createWritable();
                await writable.write(JSON.stringify(metadata, null, 2));
                await writable.close();
            }
        } catch (err) {
            // Silently fail metadata save
        }
    }
    
    async function startLiveCapture(intervalSeconds = 5) {
        if (captureInterval) {
            console.log('Capture already running');
            return;
        }
        
        // Initialize file access first
        const hasAccess = await initFileAccess();
        if (!hasAccess) {
            alert('File access required for live screenshot sharing. Please select a location to save screenshots.');
            return;
        }
        
        console.log(`Starting live capture every ${intervalSeconds} seconds`);
        captureAndSave(); // Capture immediately
        captureInterval = setInterval(captureAndSave, intervalSeconds * 1000);
        
        addCaptureIndicator();
    }
    
    function stopCapture() {
        if (captureInterval) {
            clearInterval(captureInterval);
            captureInterval = null;
            fileHandle = null;
            window.HOT_METADATA_HANDLE = null;
            console.log('Live capture stopped');
            removeCaptureIndicator();
        }
    }
    
    function addCaptureIndicator() {
        if (document.querySelector('#capture-indicator-live')) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'capture-indicator-live';
        indicator.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; background: rgba(255,0,0,0.8); 
                        color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; 
                        z-index: 10000; display: flex; align-items: center; gap: 10px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: white; 
                            border-radius: 50%; animation: pulse 2s infinite;"></span>
                <span>LIVE Recording (${captureCount} captures)</span>
                <button onclick="window.HOT_SCREENSHOT_LIVE.stopCapture()" 
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
        const indicator = document.querySelector('#capture-indicator-live span:nth-child(2)');
        if (indicator) {
            indicator.textContent = `LIVE Recording (${captureCount} captures)`;
        }
    }
    
    function removeCaptureIndicator() {
        const indicator = document.querySelector('#capture-indicator-live');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Add keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            if (captureInterval) {
                stopCapture();
            } else {
                startLiveCapture(3); // Capture every 3 seconds for live mode
            }
        }
    });
    
    return {
        startLiveCapture,
        stopCapture,
        isCapturing: () => !!captureInterval
    };
})();