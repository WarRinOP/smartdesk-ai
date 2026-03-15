// Server-only — runs in API routes, not client components
// pdf-parse is CJS; dynamic require avoids ESM default-export mismatch
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;

/**
 * Extract plain text from a PDF buffer.
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Read a text file buffer to string.
 */
export function parseTxt(buffer: Buffer): string {
  return buffer
    .toString("utf-8")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
