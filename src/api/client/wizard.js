import { createBrolympics, deleteBrolympics } from "./brolympics";
import { createEvent, defaultStagesFor } from "./events";

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
