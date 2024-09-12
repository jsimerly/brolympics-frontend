import api from "./axios";
const FRONTEND_ADDRESS = import.meta.env.VITE_FRONTEND_URL;

export const getInviteLinkLeague = (uuid) => {
  return `${FRONTEND_ADDRESS}/invite/league/${uuid}`;
};
export const getInviteLinkBrolympics = (uuid) => {
  return `${FRONTEND_ADDRESS}/invite/brolympics/${uuid}`;
};
export const getInviteLinkTeam = (uuid) => {
  return `${FRONTEND_ADDRESS}/invite/team/${uuid}`;
};

export async function fetchLeagueInviteInfo(uuid) {
  try {
    const response = await api.get(`/api/brolympics/league-invite/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchJoinLeague(uuid) {
  try {
    const response = await api.post(`/api/brolympics/join-league/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchBrolympicsInvite(uuid) {
  try {
    const response = await api.get(`/api/brolympics/brolympics-invite/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchJoinBrolympics(uuid) {
  try {
    const response = await api.post(`/api/brolympics/join-brolympics/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchTeamInvite(uuid) {
  try {
    const response = await api.get(`/api/brolympics/team-invite/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchJoinTeam(uuid) {
  try {
    const response = await api.post(`/api/brolympics/join-team/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
