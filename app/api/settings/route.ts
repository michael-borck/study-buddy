import { NextResponse } from "next/server";
import { loadSettings, parseSettings } from "@/utils/settings";

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
    // Prefer persisted file settings (Electron); fall back to environment.
    // Merge through the schema so an older file missing newer fields is filled.
    let settings = loadSettings();

    if (fileSettings) {
      const fileStoredSettings = fileSettings.loadSettingsFromFile();
      if (fileStoredSettings) {
        settings = parseSettings(fileStoredSettings);
      }
    }

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
  let newSettings;
  try {
    newSettings = parseSettings(await request.json());
  } catch (error) {
    console.error("Invalid settings payload:", error);
    return NextResponse.json(
      { error: "Invalid settings", details: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }

  try {
    // Persist to file for durability across app restarts (Electron).
    if (fileSettings) {
      const success = fileSettings.saveSettingsToFile(newSettings);
      if (!success) {
        console.warn("Failed to save settings to file, localStorage only");
      }
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}