export const QUERIES = {
    AUTH_QUERY:  "auth-query",
    RESET_VERIFY: "reset-verify",
    VERIFY_EMAIL: "verify-email",
    MAP_POINTS: "map-points",
    ESTATE_BY_ID: "estate-by-id",
    HOUSE_ESTATES: "house-estates",
    SUGGEST: "suggest",
} as const;

export type QueryType = typeof QUERIES[keyof typeof QUERIES];
