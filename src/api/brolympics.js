import api from "./axios";

export async function fetchBrolympicsHome(uuid) {
  try {
    const response = await api.get(
      `/api/brolympics/get-brolympics-home/${uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUpdateBrolympics(data) {
  try {
    const response = await api.put(`/api/brolympics/update-brolympics/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchInCompetition() {
  try {
    const response = await api.get("/api/brolympics/is-in-competition/");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchDeleteBrolympics(uuid) {
  try {
    const response = await api.delete(
      `/api/brolympics/delete-brolympics/${uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCreateBrolympics(
  league,
  brolympics,
  h2h,
  ind,
  team
) {
  const data = {
    league_uuid: league,
    brolympics: brolympics,
    h2h_events: h2h,
    ind_events: ind,
    team_events: team,
  };

  try {
    const response = await api.post("/api/brolympics/create-brolympics/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchForceOverallUpdate(uuid) {
  try {
    const response = await api.put(
      `/api/brolympics/force-update-overall/${uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
