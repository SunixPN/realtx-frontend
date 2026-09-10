export const API_ROUTES = {
  AUTH: {
    LOGIN:          '/auth/login',
    REGISTER:       '/auth/register',
    REFRESH:        '/auth/refresh',
    LOGOUT:         '/auth/logout',
    ME:             '/auth/me',
    GOOGLE_LOGIN:   '/auth/google/login',
    PHONE_LOGIN:    '/auth/phone/login',
    PASSWORD_RESET: {
      REQUEST: '/auth/password-reset/request',
      VERIFY:  '/auth/password-reset/verify',
      CONFIRM: '/auth/password-reset/confirm',
    },
  },
} as const;

export type ApiRouteType = typeof API_ROUTES[keyof typeof API_ROUTES];
