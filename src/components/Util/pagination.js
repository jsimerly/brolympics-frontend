/** Show More ladder for long league lists: 10 rows by default, then 50,
 * then 100, then doubling -- keeps the screen tidy and (paired with the
 * server-side ?limit=) keeps big leagues from hammering the API. */
export const INITIAL_VISIBLE = 10;

export const nextVisible = (current) =>
  current < 50 ? 50 : current < 100 ? 100 : current * 2;
