import { env } from "./env";
import * as hue from "node-hue-api";

async function discoverBridge() {
  const results = await hue.discovery.nupnpSearch();

  if (results.length === 0) {
    throw new Error("No bridges found! Try manually providing the ip.");
  }

  return results[0];
}

function getBridgeIp() {
  if (env.bridgeIp) {
    return env.bridgeIp;
  }
  return discoverBridge().then((bridge) => bridge.ipaddress);
}

export async function createHueApi() {
  const ip = await getBridgeIp();
  const local = hue.api.createLocal(ip);
  return local.connect(env.username, env.clientKey);
}
