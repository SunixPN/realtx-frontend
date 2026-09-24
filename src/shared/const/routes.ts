export const ROUTES = {
    SIGN_IN: "/sign-in",
    SIGN_IN_PHONE: "/sign-in/phone",
    REGISTER: "/register",
    ROOT: "/",
    RESET: "/reset",
    RESET_NEW: "/reset/new",
    VERIFY_EMAIL: "/verify-email",
    PROFILE: "/profile",
    FAVORITES: "/favorites",
    COMPARE: "/compare",
    VIEWED: "/viewed",
    SUBSCRIPTIONS: "/subscriptions",
    PROPERTY: "/property",
} as const
export type RoutesType = typeof ROUTES[keyof typeof ROUTES]