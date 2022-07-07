import z from "zod";
import { join } from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import { getUserHome, safelyParseJSON } from "./utils";
import { env } from "./env";

const Credentials = z.object({
  username: z.string().min(1),
  clientKey: z.optional(z.string()),
});

export type Credentials = z.infer<typeof Credentials>;

function getCredentialsDirectory() {
  return join(getUserHome(), ".config/hue-services");
}

function getCredentialsPath() {
  return join(getCredentialsDirectory(), "credentials.json");
}

export async function readCredentials() {
  if (env.username) {
    return {
      username: env.username,
      clientKey: env.clientKey,
    };
  }

  const filePath = getCredentialsPath();
  const fileContent = await readFile(filePath, "utf-8").catch((err) => null);

  if (!fileContent) {
    return;
  }

  const credentials = safelyParseJSON(fileContent);

  if (!credentials) {
    return;
  }

  const result = Credentials.safeParse(credentials);

  if (!result.success) {
    console.warn("Invalid credentials", result.error);
    return;
  }

  return result.data;
}

export async function writeCredentials(credentials: Credentials) {
  const filePath = getCredentialsPath();
  const content = JSON.stringify(credentials);
  await mkdir(getCredentialsDirectory(), { recursive: true });
  return writeFile(filePath, content);
}
