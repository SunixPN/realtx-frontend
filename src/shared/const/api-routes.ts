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
    SEARCH:      '/estate/search',
    MAP_POINTS:  '/estate/map-points',
    HOUSE:       '/estate/house',
    SUGGEST:     '/estate/suggest',
    BY_ID:       (id: number | string) => `/estate/${id}`,
  },
} as const;

export type ApiRouteType = typeof API_ROUTES[keyof typeof API_ROUTES];
