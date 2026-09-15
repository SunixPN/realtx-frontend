import { api } from '@/shared/api/api';
import { API_ROUTES } from '@/shared/const/api-routes';
import { MUTATIONS } from '@/shared/const/mutations';
import { MutationOptionsType } from '@/shared/types/mutation';
import { showToast } from '@/shared/helpers/show-toast';

type Body = {
    token:    string;
    password: string;
};

export type ResetConfirmResponseType = { message: string };

export const resetConfirmMutation: MutationOptionsType<Body> = {
    mutationKey: [MUTATIONS.RESET_CONFIRM],
    mutationFn: (body) => api.post<ResetConfirmResponseType>(API_ROUTES.AUTH.PASSWORD_RESET.CONFIRM, body),
    onError: (error) => {
        showToast({ status: 'error', text: error?.message });
    },
};
