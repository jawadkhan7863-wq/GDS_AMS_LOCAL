const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

// Clean up and close all windows when app is quitting
app.on('before-quit', () => {
  if (mainWindow) mainWindow.close();
});

// Create the main app window
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('http://172.16.0.5:3000/dashboard'); // Replace with your frontend URL
});
