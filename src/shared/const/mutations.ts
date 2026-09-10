export const MUTATIONS = {
  SIGN_IN:         'sign-in',
  REGISTER:        'register',
  GOOGLE_LOGIN:    'google-login',
  PHONE_LOGIN:     'phone-login',
  LOGOUT:          'logout',
  RESET_REQUEST:   'reset-request',
  RESET_CONFIRM:   'reset-confirm',
} as const;

export type MutationType = typeof MUTATIONS[keyof typeof MUTATIONS];
