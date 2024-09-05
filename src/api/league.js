import api from "./axios";

export async function fetchLeagues() {
  try {
    const response = await api.get(`/api/brolympics/all-leagues/`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchLeagueInfo(uuid) {
  try {
    const response = await api.get(`/api/brolympics/league-info/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createAllLeague(league, brolympics, h2h, ind, team) {
  const data = {
    league: league,
    brolympics: brolympics,
    h2h_events: h2h,
    ind_events: ind,
    team_events: team,
  };

  try {
    const response = await api.post("/api/brolympics/create-all-league/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUpcoming() {
  try {
    const response = await api.get(`/api/brolympics/upcoming/`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateLeague(uuid, name) {
  const data = { uuid: uuid, name: name };
  try {
    const response = await api.put("/api/brolympics/update-league/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteLeague(uuid) {
  try {
    const response = await api.delete(
      `/api/brolympics/update-league/?uuid=${uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateLeagueImg(uuid, imageFile) {
  try {
    const formData = new FormData();
    formData.append("uuid", uuid);
    formData.append("image", imageFile);
    const response = await api.put(
      "/api/brolympics/update-league/image/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
