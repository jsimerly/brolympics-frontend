import { createBrolympics, deleteBrolympics } from "./brolympics";
import { createEvent, defaultStagesFor } from "./events";
import { createLeague, deleteLeague } from "./leagues";

/** The wizard's create step, all-or-nothing: the Brolympics plus every event.
 * If an event fails after the bro was made, the orphan bro is deleted (best
 * effort) before the error surfaces — so "try again" can't stack up
 * half-built Brolympics that haunt the hamburger menu (prod, 2026-07-21). */
export const createBroWithEvents = async (broPayload, events) => {
  const bro = await createBrolympics(broPayload);
  const warnings = [];
  try {
    for (const event of events) {
      const created = await createEvent({
        brolympics: bro.uuid,
        event_type_name: event.name,
        format: event.format,
        stages: event.stages || defaultStagesFor(event.format),
        ...(event.event_type && { event_type: event.event_type }),
        ...(event.is_high_score_wins != null && {
          is_high_score_wins: event.is_high_score_wins,
        }),
        ...(event.location && { location: event.location }),
        ...(event.rules && { rules: event.rules }),
        ...(event.config && { config: event.config }),
      });
      if (created.warnings?.length) {
        warnings.push(`${event.name}: ${created.warnings.join(" ")}`);
      }
    }
  } catch (error) {
    await deleteBrolympics(bro.uuid).catch(() => {});
    throw error;
  }
  return { bro, warnings };
};

/** The from-scratch wizard's create step: league + Brolympics + events, all
 * or nothing. createBroWithEvents already unwinds the bro on event failure;
 * this adds the outer ring -- a failure anywhere after the league exists
 * deletes the fresh league too (a no-history league hard-deletes, event
 * types cascade), so retrying the wizard can't stack duplicate leagues. */
export const createLeagueWithBro = async (leaguePayload, broPayload, events) => {
  const league = await createLeague(leaguePayload);
  try {
    const { bro, warnings } = await createBroWithEvents(
      { ...broPayload, league: league.uuid },
      events
    );
    return { league, bro, warnings };
  } catch (error) {
    await deleteLeague(league.uuid).catch(() => {});
    throw error;
  }
};
