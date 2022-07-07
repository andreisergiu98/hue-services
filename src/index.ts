import { createHueApi } from "./api";
import { startAmbilightFixesService } from "./services/ambilight-fixes";

async function start() {
  const api = await createHueApi();
  startAmbilightFixesService(api);
}

start();
