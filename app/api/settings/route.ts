import { NextResponse } from "next/server";
import { getSettings, updateSettings, AppSettings } from "@/utils/settings";

export async function GET() {
  try {
    const settings = getSettings();
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
    
    // Update runtime settings
    updateSettings(newSettings);
    
    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}