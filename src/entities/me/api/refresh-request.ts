import { api } from '@/shared/api/api';
import { API_ROUTES } from '@/shared/const/api-routes';
import { AuthUserType } from '@/entities/me/types/me-type';
export type RefreshResponseType = {
    accessToken: string;
    user: AuthUserType;
};
export const refreshRequest = () => api.post<RefreshResponseType>(API_ROUTES.AUTH.REFRESH);
