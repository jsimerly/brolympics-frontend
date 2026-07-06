/**
 * The unified API client -- one module per backend resource, full coverage of
 * the v2 surface. Components import from here; the legacy modules in src/api/
 * die as their last consumers migrate.
 *
 * Conventions:
 * - every function returns response.data (axios errors propagate to the caller)
 * - uuids in, plain objects out -- shapes match the DRF serializers 1:1
 * - one Contest shape for every format; `kind` (match|outing|heat) discriminates
 */
export * from "./leagues";
export * from "./brolympics";
export * from "./events";
export * from "./contests";
export * from "./teams";
export * from "./players";
