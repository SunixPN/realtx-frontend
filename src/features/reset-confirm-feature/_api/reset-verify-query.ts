import { queryOptions } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import { API_ROUTES } from '@/shared/const/api-routes';
import { QUERIES } from '@/shared/const/queries';

type VerifyResponse = { valid: true };

export const resetVerifyQuery = (token: string) =>
    queryOptions({
        queryKey: [QUERIES.RESET_VERIFY, token],
        queryFn:  async () => api.post<VerifyResponse>(API_ROUTES.AUTH.PASSWORD_RESET.VERIFY, { token }),
        select:   (response) => response.data,
        enabled:  !!token,
        retry:    false,
        staleTime: Infinity,
    });
