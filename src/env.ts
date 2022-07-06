const username = process.env.HUE_USERNAME;
const clientKey = process.env.HUE_CLIENT_KEY;
const bridgeIp = process.env.HUE_BRIDGE_IP;

if (!username) {
  throw new Error("HUE_USERNAME is not set");
}

if (!clientKey) {
  throw new Error("HUE_CLIENT_KEY is not set");
}

export const env = {
  username,
  clientKey,
  bridgeIp,
};
