import { Api } from "node-hue-api/dist/esm/api/Api";
import { createHueApi } from "../api";

async function getRedundantAmbilightAreas(api: Api) {
  const areas = await api.groups.getEntertainment();

  const ambilightIds = areas
    .filter((area) => area.name === "Entertainment area" && area.class === "TV")
    .map((area) => Number(area.id));

  const latestId = Math.max(...ambilightIds);
  return ambilightIds.filter((id) => id !== latestId);
}

async function deleteAmbilightAreas(api: Api, ids: number[]) {
  console.log("Deleting ambilight areas", ids);
  const promises = ids.map((id) => api.groups.deleteGroup(id));
  return Promise.all(promises);
}

async function cleanAmbilightAreas() {
  try {
    const api = await createHueApi();
    const ids = await getRedundantAmbilightAreas(api);
    await deleteAmbilightAreas(api, ids);
  } catch (e) {
    console.log(e);
  }
}

export function startAmbilightFixesService() {
  setInterval(() => {
    cleanAmbilightAreas();
  }, 15 * 60 * 1000);
}
