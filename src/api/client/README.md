# API client

One module per backend resource; full coverage of the unified `/api/` surface.

- Functions return `response.data`; axios errors propagate to callers.
- Shapes match the DRF serializers 1:1 (one Contest shape for all formats;
  `kind` = match | outing | heat discriminates).
- Page-level compositions (`fetchLeagueDetail`, `fetchUpcoming`) live here too,
  so components stay presentation-only.
- Legacy modules in `src/api/*.js` are deleted as their last consumers migrate.
