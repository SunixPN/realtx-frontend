export const QUERIES = {
    AUTH_QUERY:              "auth-query",
    RESET_VERIFY:            "reset-verify",
    VERIFY_EMAIL:            "verify-email",
    MAP_POINTS:              "map-points",
    DISTRICT_PROFITABILITY:  "district-profitability",
    DISTRICTS_GEOJSON:       "districts-geojson",
    ESTATE_BY_ID:            "estate-by-id",
    HOUSE_ESTATES:           "house-estates",
    SUGGEST:                 "suggest",
    CURRENCY_RATES:          "currency-rates",
    FAVORITES:               "favorites",
    FAVORITE_IDS:            "favorite-ids",
    VIEWED:                  "viewed",
    VIEWED_IDS:              "viewed-ids",
    SUBSCRIPTIONS:           "subscriptions",
} as const;
export type QueryType = typeof QUERIES[keyof typeof QUERIES];
