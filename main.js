// Add command line arguments for development BEFORE requiring electron
const isDev = process.env.NODE_ENV !== 'production' && !process.resourcesPath;

// Import electron
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Set command line switches before app is ready
if (isDev) {
  app.commandLine.appendSwitch('--no-sandbox');
  app.commandLine.appendSwitch('--disable-web-security');
  app.commandLine.appendSwitch('--disable-gpu-sandbox');
  app.commandLine.appendSwitch('--disable-software-rasterizer');
}

const next = require('next');
const getPort = require('get-port').default;

// Set persistent user data directory
const userDataPath = isDev 
  ? path.join(__dirname, 'electron-dev-data') 
  : app.getPath('userData');

if (isDev) {
  app.setPath('userData', userDataPath);
  console.log('📁 Setting dev userData path:', userDataPath);
} else {
  console.log('📁 Using production userData path:', userDataPath);
}

// Ensure the directory exists (only in development mode)
if (isDev) {
  if (!fs.existsSync(userDataPath)) {
    console.log('📂 Creating dev userData directory:', userDataPath);
    fs.mkdirSync(userDataPath, { recursive: true });
    console.log('✅ Dev userData directory created');
  } else {
    console.log('📂 Dev userData directory already exists');
  }
} else {
  console.log('📂 Using production userData path (Electron will handle creation):', userDataPath);
}

// List what's in the directory (development only)
if (isDev) {
  try {
    const files = fs.readdirSync(userDataPath);
    console.log('📁 Contents of dev userData directory:', files);
  } catch (e) {
    console.log('📁 Could not read dev userData directory contents:', e.message);
  }
}

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
      webSecurity: false, // Disable for development
      partition: 'persist:study-buddy', // Use persistent session
      sandbox: false // Disable sandbox for Linux compatibility
    },
    titleBarStyle: 'default',
    show: true // Show immediately for debugging
  });

  console.log('Created BrowserWindow, loading URL...');

  // Load the Next.js app
  try {
    console.log(`Loading URL: http://localhost:${port}`);
    await mainWindow.loadURL(`http://localhost:${port}`);
    console.log('URL loaded successfully');
  } catch (error) {
    console.error('Failed to load URL:', error);
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready-to-show event fired');
    mainWindow.show();
    console.log('Window should now be visible');
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Additional debugging
  mainWindow.once('show', () => {
    console.log('Window show event fired');
  });

  mainWindow.webContents.once('did-finish-load', () => {
    console.log('WebContents did-finish-load event fired');
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