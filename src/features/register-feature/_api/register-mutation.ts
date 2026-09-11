import { api } from '@/shared/api/api';
import { API_ROUTES } from '@/shared/const/api-routes';
import { MUTATIONS } from '@/shared/const/mutations';
import { MutationOptionsType } from '@/shared/types/mutation';
import { showToast } from '@/shared/helpers/show-toast';
import { AuthResponseType } from '@/entities/me/types/me-type';
import { queryClient } from '@/shared/api/query';
import { QUERIES } from '@/shared/const/queries';

type Body = {
    name?: string;
    email: string;
    password: string;
};

export const registerMutation: MutationOptionsType<Body> = {
    mutationKey: [MUTATIONS.REGISTER],
    mutationFn: (body) => api.post<AuthResponseType>(API_ROUTES.AUTH.REGISTER, body),
    onSuccess: () => {
        showToast({ status: 'success', text: 'Аккаунт создан' });
        queryClient.invalidateQueries({ queryKey: [QUERIES.AUTH_QUERY] });
    },
    onError: (error) => {
        showToast({ status: 'error', text: error?.message });
    },
};
