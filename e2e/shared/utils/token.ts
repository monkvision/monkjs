import pako from "pako";

export interface AuthUrlOptions {
  /** Pre-existing inspection ID to inject via ?i= (skips CreateInspection step). */
  inspectionId?: string;
  /** Vehicle type to pre-select via ?v= (skips VehicleTypeSelection step). */
  vehicleType?: string;
}

function compressToken(rawToken: string): string {
  const binary = new TextEncoder().encode(rawToken);
  const compressed = pako.deflate(binary);
  const base64 = btoa(String.fromCharCode(...Array.from(compressed)));
  return encodeURIComponent(base64);
}

export function getTestToken(): string {
  const token = process.env["TEST_TOKEN"];
  if (!token) {
    throw new Error(
      "TEST_TOKEN environment variable is not set. See e2e/.env.example."
    );
  }
  return token;
}

export function buildAuthUrl(
  baseUrl: string,
  options?: AuthUrlOptions
): string {
  let url = `${baseUrl}?t=${compressToken(getTestToken())}`;
  if (options?.inspectionId)
    url += `&i=${encodeURIComponent(options.inspectionId)}`;
  if (options?.vehicleType)
    url += `&v=${encodeURIComponent(options.vehicleType)}`;
  return url;
}
