import { NextResponse } from "next/server";
import { getSettings, updateSettings, AppSettings } from "@/utils/settings";

// Import file settings helper (only works in Node.js environment)
let fileSettings: any = null;
try {
  fileSettings = require("@/utils/file-settings");
  console.log("✅ File settings module loaded successfully");
} catch (e: any) {
  console.log("❌ File settings not available (probably in browser):", e.message);
}

export async function GET() {
  try {
    // Try to load from file first if available
    let settings = getSettings();
    
    if (fileSettings) {
      console.log('🔍 Checking for file-stored settings...');
      const fileStoredSettings = fileSettings.loadSettingsFromFile();
      if (fileStoredSettings) {
        console.log('📂 Loaded settings from file, applying to runtime');
        updateSettings(fileStoredSettings);
        settings = getSettings();
      } else {
        console.log('📂 No file-stored settings found');
      }
    } else {
      console.log('📂 File settings not available');
    }
    
    console.log('GET settings called, returning:', { 
      provider: settings.llmProvider, 
      baseUrl: settings.llmBaseUrl,
      model: settings.llmModel 
    });
    
    // Don't send API keys to frontend for security
    const safeSettings = {
      ...settings,
      llmApiKey: settings.llmApiKey ? "***" : "",
      searchApiKey: settings.searchApiKey ? "***" : "",
    };
    return NextResponse.json(safeSettings);
  } catch (error) {
    console.error("Error getting settings:", error);
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSettings: AppSettings = await request.json();
    console.log('POST settings called with:', { 
      provider: newSettings.llmProvider, 
      baseUrl: newSettings.llmBaseUrl,
      model: newSettings.llmModel,
      hasApiKey: !!newSettings.llmApiKey
    });
    
    // Update runtime settings
    updateSettings(newSettings);
    
    // Also save to file for persistence across app restarts
    if (fileSettings) {
      console.log('💾 Attempting to save settings to file...');
      const success = fileSettings.saveSettingsToFile(newSettings);
      if (success) {
        console.log('✅ Settings also saved to persistent file');
      } else {
        console.warn('❌ Failed to save settings to file, localStorage only');
      }
    } else {
      console.log('💾 File settings not available, using localStorage only');
    }
    
    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}