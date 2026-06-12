import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

const MAX_BYTES = 20 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File is too large (20 MB max)" },
        { status: 413 },
      );
    }

    const parser = new PDFParse({ data: new Uint8Array(await file.arrayBuffer()) });
    try {
      const result = await parser.getText();
      const text = (result.text || "").trim();
      if (!text) {
        return NextResponse.json(
          {
            error:
              "No readable text found in this PDF — it may be a scanned image",
          },
          { status: 422 },
        );
      }
      return NextResponse.json({ text });
    } finally {
      await parser.destroy?.();
    }
  } catch (e) {
    console.error("PDF parse error:", e);
    return NextResponse.json(
      { error: "Could not read this PDF" },
      { status: 500 },
    );
  }
}
