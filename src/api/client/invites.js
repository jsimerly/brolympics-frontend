/** Shareable invite links (pure URL builders; the previews/joins live on the
 * resource modules: fetchLeagueInvite/joinLeague etc.). */
const FRONTEND_ADDRESS = import.meta.env.VITE_FRONTEND_URL;

export const inviteLinkLeague = (uuid) =>
  `${FRONTEND_ADDRESS}/invite/league/${uuid}`;

export const inviteLinkBrolympics = (uuid) =>
  `${FRONTEND_ADDRESS}/invite/brolympics/${uuid}`;

export const inviteLinkTeam = (uuid) =>
  `${FRONTEND_ADDRESS}/invite/team/${uuid}`;
