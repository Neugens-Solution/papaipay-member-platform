import "server-only";
import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

export class GoogleSheetsError extends Error {}

/**
 * Accepts the key however it was pasted into Vercel: the bare PEM, the JSON
 * string value (with quotes, trailing comma and literal "\n"), or the whole
 * service-account JSON file.
 */
export function normalizePrivateKey(raw: string | undefined) {
  let value = raw?.trim();
  if (!value) return undefined;
  if (value.startsWith("{")) {
    try {
      const parsed = JSON.parse(value) as { private_key?: string };
      if (parsed.private_key) value = parsed.private_key;
    } catch {
      // not valid JSON; fall through and try to clean it up as a PEM string
    }
  }
  value = value.replace(/,\s*$/, "").replace(/^"private_key"\s*:\s*/, "").replace(/^"|"$/g, "");
  value = value.replace(/\\n/g, "\n").replace(/\r/g, "");
  const match = value.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/);
  if (!match) return value;
  // Rebuild a clean PEM (handles keys pasted on one line with spaces instead of newlines).
  const body = match[0].replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "").replace(/\s+/g, "");
  return `-----BEGIN PRIVATE KEY-----\n${body.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----\n`;
}

function serviceAccount() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim().replace(/^"|",?$/g, "");
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
  if (!email || !privateKey) {
    throw new GoogleSheetsError(
      "Google Sheets import is not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.",
    );
  }
  return { email, privateKey };
}

export function serviceAccountEmail() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || null;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

async function accessToken() {
  const { email, privateKey } = serviceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({ iss: email, scope: SHEETS_SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }));
  let signature: string;
  try {
    signature = createSign("RSA-SHA256").update(`${header}.${claims}`).sign(privateKey, "base64url");
  } catch {
    const looksLikePem = privateKey.includes("BEGIN PRIVATE KEY");
    throw new GoogleSheetsError(
      looksLikePem
        ? "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY looks incomplete. Copy the whole private_key value from the JSON file again."
        : "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY does not contain a private key. Paste the private_key value (starting with -----BEGIN PRIVATE KEY-----) from the JSON file.",
    );
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${claims}.${signature}` }),
    cache: "no-store",
  });
  const json = (await response.json().catch(() => ({}))) as { access_token?: string; error_description?: string };
  if (!response.ok || !json.access_token) {
    throw new GoogleSheetsError(`Google authentication failed. ${json.error_description ?? ""}`.trim());
  }
  return json.access_token;
}

/** Accepts a full Google Sheets URL or a bare spreadsheet id. */
export function parseSpreadsheetId(input: string) {
  const trimmed = input.trim();
  const fromUrl = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/)?.[1];
  if (fromUrl) return fromUrl;
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  return null;
}

/**
 * Reads the given tabs as formatted strings (what the user sees in the sheet).
 * Missing tabs come back as null instead of failing the whole read.
 */
export async function readSheetTabs(spreadsheetId: string, tabs: string[]): Promise<Record<string, string[][] | null>> {
  const token = await accessToken();
  const result: Record<string, string[][] | null> = {};
  await Promise.all(
    tabs.map(async (tab) => {
      const range = encodeURIComponent(`'${tab.replace(/'/g, "''")}'`);
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueRenderOption=FORMATTED_VALUE`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
      );
      if (response.status === 400) {
        result[tab] = null; // tab does not exist
        return;
      }
      if (response.status === 403 || response.status === 404) {
        throw new GoogleSheetsError(
          `Cannot open this Google Sheet. Share it (Viewer) with ${serviceAccountEmail() ?? "the service account email"} and try again.`,
        );
      }
      if (!response.ok) throw new GoogleSheetsError(`Google Sheets returned HTTP ${response.status}.`);
      const json = (await response.json()) as { values?: unknown[][] };
      result[tab] = (json.values ?? []).map((row) => row.map((cell) => String(cell ?? "")));
    }),
  );
  return result;
}
