import { api } from '@/shared/api/api';
import { API_ROUTES } from '@/shared/const/api-routes';
import { MUTATIONS } from '@/shared/const/mutations';
import { MutationOptionsType } from '@/shared/types/mutation';
import { showToast } from '@/shared/helpers/show-toast';
import { queryClient } from '@/shared/api/query';
import { QUERIES } from '@/shared/const/queries';

export const logoutMutation: MutationOptionsType<void> = {
    mutationKey: [MUTATIONS.LOGOUT],
    mutationFn: () => api.post(API_ROUTES.AUTH.LOGOUT),
    onSuccess: () => {
        showToast({ status: 'success', text: 'Вы вышли из аккаунта' });
        queryClient.setQueryData([QUERIES.AUTH_QUERY], null);
    },
    onError: (error) => {
        showToast({ status: 'error', text: error?.message ?? 'Не удалось выйти' });
    },
};
