import { hostname } from "os";
import { ApiError } from "node-hue-api";
import { Api } from "node-hue-api/dist/esm/api/Api";
import { LocalBootstrap } from "node-hue-api/dist/esm/api/http/LocalBootstrap";
import { Credentials, readCredentials, writeCredentials } from "./credentials";
import { delay } from "./utils";

async function createUser(api: Api) {
  try {
    const user = await api.users.createUser("hue-services", hostname());
    const credentials: Credentials = {
      username: user.username,
      clientKey: user.clientkey,
    };
    writeCredentials(credentials);
    return { credentials };
  } catch (error) {
    return { error };
  }
}

async function createUserOrWaitForButton(
  api: Api,
  tries = 0
): Promise<Credentials> {
  // retry every 30 seconds
  const interval = 15 * 1000;

  const { credentials, error } = await createUser(api);

  if (credentials) {
    console.log("Successfully linked service to your hue bridge!");
    return credentials;
  }

  // Not button not pressed error
  if (!(error instanceof ApiError) || error.getHueErrorType() !== 101) {
    throw error;
  }

  if (tries === 8) {
    throw new Error("Timeout! Button not pressed for 2 minutes!");
  }

  await delay(interval);
  return createUserOrWaitForButton(api, tries + 1);
}

async function createLoginCredentials(local: LocalBootstrap) {
  const apiWithoutAuth = await local.connect();
  console.log(
    "Linking service to your hue bridge, please press the blue button!"
  );
  return createUserOrWaitForButton(apiWithoutAuth);
}

export async function login(local: LocalBootstrap) {
  let credentials = await readCredentials();
  if (!credentials) {
    credentials = await createLoginCredentials(local);
  }
  return local.connect(credentials.username, credentials.clientKey);
}
