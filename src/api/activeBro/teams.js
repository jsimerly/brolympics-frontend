import api from "../axios";

export async function fetchTeamInfo(uuid) {
  try {
    const response = await api.get(`/api/brolympics/get-team-info/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
