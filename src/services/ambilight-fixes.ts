import { Api } from "node-hue-api/dist/esm/api/Api";

async function getRedundantAmbilightAreas(api: Api) {
  const areas = await api.groups.getEntertainment();

  const ambilightIds = areas
    .filter((area) => area.name === "Entertainment area" && area.class === "TV")
    .map((area) => Number(area.id));

  const latestId = Math.max(...ambilightIds);
  return ambilightIds.filter((id) => id !== latestId);
}

async function deleteAmbilightAreas(api: Api, ids: number[]) {
  if (ids.length === 0) {
    return;
  }

  console.log("Deleting ambilight areas", ids);
  const promises = ids.map((id) => api.groups.deleteGroup(id));
  return Promise.all(promises);
}

async function cleanAmbilightAreas(api: Api) {
  try {
    const ids = await getRedundantAmbilightAreas(api);
    await deleteAmbilightAreas(api, ids);
  } catch (e) {
    console.log(e);
  }
}

export function startAmbilightFixesService(api: Api) {
  console.log("Started ambilight fixes service");

  cleanAmbilightAreas(api);

  setInterval(() => {
    cleanAmbilightAreas(api);
  }, 5 * 60 * 1000);
}
