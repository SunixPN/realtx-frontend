import { api } from '@/shared/api/api';
import { API_ROUTES } from '@/shared/const/api-routes';
import { MUTATIONS } from '@/shared/const/mutations';
import { MutationOptionsType } from '@/shared/types/mutation';
import { showToast } from '@/shared/helpers/show-toast';
import {AuthUserType} from "@/entities/me/types/me-type";
import {queryClient} from "@/shared/api/query";
import {QUERIES} from "@/shared/const/queries";

export type AuthResponseType = {
    accessToken: string;
    user: AuthUserType;
}

type Body = {
  email: string;
  password: string;
};

export const signInMutation: MutationOptionsType<Body> = {
    mutationKey: [MUTATIONS.SIGN_IN],
    mutationFn: (body) => api.post<AuthResponseType>(API_ROUTES.AUTH.LOGIN, body),
    onSuccess: () => {
        showToast({ status: 'success', text: 'Вход выполнен' })
        queryClient.invalidateQueries({ queryKey: [QUERIES.AUTH_QUERY] })
    },
    onError: (error) => {
        showToast({ status: 'error', text: error?.message })
    },
};
