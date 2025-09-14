// Preload script for Electron
// This runs in the renderer context before the page loads

const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// limited Electron APIs without full Node.js access
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform
});