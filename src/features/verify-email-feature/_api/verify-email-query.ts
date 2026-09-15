import { queryOptions } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import { API_ROUTES } from '@/shared/const/api-routes';
import { QUERIES } from '@/shared/const/queries';

type VerifyEmailResponse = { message: string };

export const verifyEmailQuery = (token: string) =>
    queryOptions({
        queryKey: [QUERIES.VERIFY_EMAIL, token],
        queryFn:  async () => api.post<VerifyEmailResponse>(API_ROUTES.AUTH.VERIFY_EMAIL, { token }),
        select:   (response) => response.data,
        enabled:  !!token,
        retry:    false,
        staleTime: Infinity,
    });
