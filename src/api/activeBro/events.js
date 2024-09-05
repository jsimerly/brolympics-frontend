import api from "../axios";

export async function fetchEventInfo(uuid, type) {
  try {
    const response = await api.get(
      `/api/brolympics/get-event-info/${uuid}/${type}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
