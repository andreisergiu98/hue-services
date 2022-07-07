import { join } from "path";

export function getUserHome() {
  const homeEnv = process.platform == "win32" ? "USERPROFILE" : "HOME";
  const home = process.env[homeEnv] || "";
  return join(home, "./");
}

export function safelyParseJSON(
  content: string
): Record<string, unknown> | void {
  try {
    return JSON.parse(content);
  } catch (e) {
    // do nothing
  }
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
