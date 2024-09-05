import api from "../axios";

export async function fetchHome(uuid) {
  try {
    const response = await api.get(`/api/brolympics/get-active-home/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchStartComp(uuid, type) {
  const data = { uuid: uuid, type: type };
  try {
    const response = await api.put("/api/brolympics/start-competition/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchActiveComp_h2h(uuid) {
  try {
    const response = await api.get(`/api/brolympics/get-comp-h2h/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchSubmitComp_h2h(uuid, team_1_score, team_2_score) {
  const data = {
    uuid: uuid,
    team_1_score: team_1_score,
    team_2_score: team_2_score,
  };
  try {
    const response = await api.put(
      "/api/brolympics/end-competition-h2h/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCancelComp_h2h(uuid) {
  const data = { uuid: uuid };
  try {
    const response = await api.put(
      "/api/brolympics/cancel-competition-h2h/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchActiveComp_ind(uuid) {
  try {
    const response = await api.get(`/api/brolympics/get-comp-ind/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchSubmitComp_ind(
  uuid,
  player_1_score,
  player_2_score
) {
  const data = {
    uuid: uuid,
    player_1_score: player_1_score,
    player_2_score: player_2_score,
  };
  try {
    const response = await api.put(
      "/api/brolympics/end-competition-ind/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCancelComp_ind(uuid) {
  const data = { uuid: uuid };
  try {
    const response = await api.put(
      "/api/brolympics/cancel-competition-ind/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchActiveComp_team(uuid) {
  try {
    const response = await api.get(`/api/brolympics/get-comp-team/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchSubmitComp_team(uuid, team_score) {
  const data = {
    uuid: uuid,
    team_score: team_score,
  };
  try {
    const response = await api.put(
      "/api/brolympics/end-competition-team/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCancelComp_team(uuid) {
  const data = { uuid: uuid };
  try {
    const response = await api.put(
      "/api/brolympics/cancel-competition-team/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
