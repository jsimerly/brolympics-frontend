/** Countdown/date-range helpers shared by League and the pre-bro home.
 * Extracted from inline copies so the countdown math can't diverge. */
import { format, parseISO } from "date-fns";

/** Whole days until the ISO date (ceil), null when absent or unparseable. */
export const daysUntil = (iso) => {
  if (!iso) return null;
  try {
    const days = Math.ceil((parseISO(iso) - new Date()) / (1000 * 60 * 60 * 24));
    return Number.isNaN(days) ? null : days;
  } catch {
    return null;
  }
};

/** "Jul 18 – Jul 20", or the single known end when only one exists. */
export const formatDateRange = (start, end) => {
  const fmt = (d) => format(parseISO(d), "MMM d");
  try {
    if (start && end) return `${fmt(start)} – ${fmt(end)}`;
    return start ? fmt(start) : end ? fmt(end) : null;
  } catch {
    return null;
  }
};
