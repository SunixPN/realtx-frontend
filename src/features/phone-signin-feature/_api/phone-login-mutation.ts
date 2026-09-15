import { api } from '@/shared/api/api';
import { API_ROUTES } from '@/shared/const/api-routes';
import { MUTATIONS } from '@/shared/const/mutations';
import { MutationOptionsType } from '@/shared/types/mutation';
import { AuthResponseType } from '@/entities/me/types/me-type';
import { showToast } from '@/shared/helpers/show-toast';
import { queryClient } from '@/shared/api/query';
import { QUERIES } from '@/shared/const/queries';

type Body = { idToken: string };

export const phoneLoginMutation: MutationOptionsType<Body> = {
    mutationKey: [MUTATIONS.PHONE_LOGIN],
    mutationFn: (body) => api.post<AuthResponseType>(API_ROUTES.AUTH.PHONE_LOGIN, body),
    onSuccess: () => {
        showToast({ status: 'success', text: 'Вход выполнен' });
        queryClient.invalidateQueries({ queryKey: [QUERIES.AUTH_QUERY] });
    },
    onError: (error) => {
        showToast({ status: 'error', text: error?.message });
    },
};
