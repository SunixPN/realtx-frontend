import { api } from '@/shared/api/api';
import { API_ROUTES } from '@/shared/const/api-routes';
import { MUTATIONS } from '@/shared/const/mutations';
import { MutationOptionsType } from '@/shared/types/mutation';
import { showToast } from '@/shared/helpers/show-toast';

type Body = { email: string };

export type ResetRequestResponseType = { message: string };

export const resetRequestMutation: MutationOptionsType<Body> = {
    mutationKey: [MUTATIONS.RESET_REQUEST],
    mutationFn: (body) => api.post<ResetRequestResponseType>(API_ROUTES.AUTH.PASSWORD_RESET.REQUEST, body),
    onError: (error) => {
        showToast({ status: 'error', text: error?.message });
    },
};
