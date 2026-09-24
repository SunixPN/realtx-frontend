export type UserCurrency = 'USD' | 'BYN' | 'EUR';
export type UserTheme   = 'light' | 'dark' | 'system';
export type UserLanguage = 'ru' | 'en' | 'be';
export type AuthResponseType = {
    accessToken: string;
    user: AuthUserType;
};
export type AuthUserType = {
    id: string;
    email: string | null;
    name: string | null;
    emailVerified: boolean;
    phone: string | null;
    phoneVerified: boolean;
    city: string | null;
    googleId: string | null;
    telegramId: string | null;
    currency: UserCurrency;
    theme: UserTheme;
    language: UserLanguage;
    notifyByEmail: boolean;
    notifyByTelegram: boolean;
    weeklyDigest: boolean;
    syncHistory: boolean;
    personalRecommendations: boolean;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
    favoritesCount: number;
    subscriptionsCount: number;
    compareCount: number;
    viewedCount: number;
    subscriptionsFreshCount: number;
}
