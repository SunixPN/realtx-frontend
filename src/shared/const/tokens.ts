export const TOKENS = {
    REFRESH_TOKEN: "refresh_token",
    ACCESS_TOKEN: "access_token",
} as const

export type TokensType = typeof TOKENS[keyof typeof TOKENS]