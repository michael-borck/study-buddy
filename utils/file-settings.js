// File-based settings storage for Electron
const fs = require('fs');
const path = require('path');
const os = require('os');

const isDev = process.env.NODE_ENV !== 'production';

function getSettingsFilePath() {
  let userDataPath;
  
  if (isDev) {
    // Development: use project directory
    userDataPath = path.join(process.cwd(), 'electron-dev-data');
  } else {
    // Production: use proper user data directories per OS
    const appName = 'StudyBuddy';
    
    switch (process.platform) {
      case 'win32':
        userDataPath = path.join(os.homedir(), 'AppData', 'Roaming', appName);
        break;
      case 'darwin':
        userDataPath = path.join(os.homedir(), 'Library', 'Application Support', appName);
        break;
      case 'linux':
        userDataPath = path.join(os.homedir(), '.config', appName);
        break;
      default:
        // Fallback
        userDataPath = path.join(os.homedir(), '.study-buddy');
        break;
    }
  }
  
  return path.join(userDataPath, 'study-buddy-settings.json');
}

function saveSettingsToFile(settings) {
  try {
    const settingsPath = getSettingsFilePath();
    const dir = path.dirname(settingsPath);
    
    console.log('📁 Attempting to save settings to:', settingsPath);
    console.log('📋 Settings to save:', JSON.stringify(settings, null, 2));
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      console.log('📂 Creating directory:', dir);
      fs.mkdirSync(dir, { recursive: true });
    } else {
      console.log('📂 Directory already exists:', dir);
    }
    
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    console.log('✅ Settings successfully saved to file:', settingsPath);
    
    // Verify the file was written
    if (fs.existsSync(settingsPath)) {
      const fileSize = fs.statSync(settingsPath).size;
      console.log('✅ File exists and is', fileSize, 'bytes');
      return true;
    } else {
      console.error('❌ File was not created!');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to save settings to file:', error);
    return false;
  }
}

function loadSettingsFromFile() {
  try {
    const settingsPath = getSettingsFilePath();
    
    console.log('📖 Attempting to load settings from:', settingsPath);
    
    if (fs.existsSync(settingsPath)) {
      console.log('📄 Settings file exists, reading...');
      const data = fs.readFileSync(settingsPath, 'utf8');
      console.log('📄 Raw file content:', data);
      
      const settings = JSON.parse(data);
      console.log('✅ Settings successfully loaded from file:', settingsPath);
      console.log('📋 Loaded settings:', JSON.stringify(settings, null, 2));
      return settings;
    } else {
      console.log('📄 No settings file found at:', settingsPath);
    }
  } catch (error) {
    console.error('❌ Failed to load settings from file:', error);
  }
  
  return null;
}

module.exports = {
  saveSettingsToFile,
  loadSettingsFromFile,
  getSettingsFilePath
};