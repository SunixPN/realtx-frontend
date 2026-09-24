export const API_ROUTES = {
  AUTH: {
    LOGIN:          '/auth/login',
    REGISTER:       '/auth/register',
    REFRESH:        '/auth/refresh',
    LOGOUT:         '/auth/logout',
    ME:             '/auth/me',
    GOOGLE_LOGIN:   '/auth/google/login',
    PHONE_LOGIN:    '/auth/phone/login',
    VERIFY_EMAIL:   '/auth/verify-email',
    PASSWORD_RESET: {
      REQUEST: '/auth/password-reset/request',
      VERIFY:  '/auth/password-reset/verify',
      CONFIRM: '/auth/password-reset/confirm',
    },
  },
  ESTATE: {
    SEARCH:                 '/estate/search',
    MAP_POINTS:             '/estate/map-points',
    DISTRICT_PROFITABILITY: '/estate/district-profitability',
    DISTRICTS_GEOJSON:      '/estate/districts-geojson',
    HOUSE:                  '/estate/house',
    SUGGEST:                '/estate/suggest',
    BY_ID:                  (id: number | string) => `/estate/${id}`,
  },
  CURRENCY: {
    RATES: '/currency/rates',
  },
  FAVORITES: {
    LIST:         '/favorites',
    IDS:          '/favorites/ids',
    ADD:          (id: number) => `/favorites/${id}`,
    REMOVE:       (id: number) => `/favorites/${id}`,
    BULK_REMOVE:  '/favorites/bulk',
  },
  VIEWED: {
    LIST:   '/viewed',
    IDS:    '/viewed/ids',
    LOG:    (id: number) => `/viewed/${id}`,
    REMOVE: (id: number) => `/viewed/${id}`,
    CLEAR:  '/viewed',
  },
  SUBSCRIPTIONS: {
    LIST:   '/search-subscriptions',
    CREATE: '/search-subscriptions',
    UPDATE: (id: string) => `/search-subscriptions/${id}`,
    PAUSE:  (id: string) => `/search-subscriptions/${id}/pause`,
    MARK_SEEN: (id: string) => `/search-subscriptions/${id}/mark-seen`,
    REMOVE: (id: string) => `/search-subscriptions/${id}`,
  },
} as const;
export type ApiRouteType = typeof API_ROUTES[keyof typeof API_ROUTES];
