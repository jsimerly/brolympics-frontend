import api from "../axios";

export async function fetchStandings(uuid) {
  try {
    const response = await api.get(
      `/api/brolympics/get-standings-info/${uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
