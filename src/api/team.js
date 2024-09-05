import api from "./axios";

export async function fetchLeagueTeams(uuid) {
  try {
    const response = await api.get(`/api/brolympics/league-teams/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCreateSingleTeam(
  name,
  brolympicsUUID,
  userJoin = false
) {
  const data = {
    name: name,
    brolympics_uuid: brolympicsUUID,
    user_join: userJoin,
  };
  try {
    const response = await api.post(
      "/api/brolympics/create-single-team/",
      data
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchDeleteTeam(team_uuid) {
  try {
    const response = await api.delete(
      `/api/brolympics/delete-team/${team_uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchRemovePlayer(player_uuid, team_uuid) {
  try {
    const response = await api.delete(
      `/api/brolympics/remove-player-team/${player_uuid}/${team_uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUpdateTeamImage(imageFile, team_uuid) {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("uuid", team_uuid);
    const response = await api.put(
      `/api/brolympics/update-team-image/`,
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
