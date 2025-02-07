const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited set of APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer
});
