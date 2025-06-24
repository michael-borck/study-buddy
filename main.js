// Add command line arguments for development BEFORE requiring electron
const isDev = process.env.NODE_ENV !== 'production';

// Import electron
const { app, BrowserWindow } = require('electron');

// Set command line switches before app is ready
if (isDev) {
  app.commandLine.appendSwitch('--no-sandbox');
  app.commandLine.appendSwitch('--disable-web-security');
}

const next = require('next');
const getPort = require('get-port').default;
const path = require('path');

// Initialize Next.js
const nextApp = next({ 
  dev: isDev,
  dir: __dirname
});

let mainWindow;
let server;
let port;

async function createWindow() {
  // Get an available port starting from 3000
  port = await getPort({ port: 3000 });
  
  // Prepare Next.js
  await nextApp.prepare();
  
  // Start the Next.js server
  server = require('http').createServer(nextApp.getRequestHandler());
  
  await new Promise((resolve) => {
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Study Buddy server ready on http://localhost:${port}`);
      resolve();
    });
  });

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets/icon.png'), // We'll add this later
    titleBarStyle: 'default',
    show: false // Don't show until ready
  });

  // Load the Next.js app
  await mainWindow.loadURL(`http://localhost:${port}`);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Close the server when all windows are closed
  if (server) {
    server.close();
  }
  
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    // Could open in external browser if needed
    // require('electron').shell.openExternal(navigationUrl);
  });
});

// Handle app protocol for better security
app.setAsDefaultProtocolClient('studybuddy');

// Export for potential IPC communication later
module.exports = { app, mainWindow };