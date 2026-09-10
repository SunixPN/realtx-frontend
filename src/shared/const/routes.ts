export const ROUTES = {
    SIGN_IN: "/sign-in",
    REGISTER: "/register",
    ROOT: "/",
    RESET: "/password-recovery"
} as const

export type RoutesType = typeof ROUTES[keyof typeof ROUTES]