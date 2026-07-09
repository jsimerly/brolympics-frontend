/** Where to land after signing in: the page that sent us here (an invite
 * link, usually) or home. App.jsx stashes it in location.state.from. */
export const afterAuthPath = (location) => {
  const from = location?.state?.from;
  if (!from) return "/";
  if (typeof from === "string") return from;
  return `${from.pathname ?? "/"}${from.search ?? ""}`;
};

export const isInviteBound = (location) =>
  afterAuthPath(location).startsWith("/invite/");
