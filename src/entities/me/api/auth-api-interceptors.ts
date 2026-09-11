import {queryClient} from "@/shared/api/query";
import {authQuery} from "@/entities/me/api/auth-query";
import {AxiosError} from "axios";
import {api, ApiError} from "@/shared/api/api";

api.interceptors.request.use((config) => {
    if (typeof window === 'undefined') return config;
    const data = queryClient.getQueryData(authQuery.queryKey);
    if (data?.accessToken) {
        config.headers.set('Authorization', `Bearer ${data.accessToken}`);
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
        if (error instanceof AxiosError) {
            if (error.response?.data?.error?.message) {
                throw new ApiError(error.response?.data?.error?.message?.join(",") ?? "Что-то пошло не так", error.status || 500);
            }

            throw new ApiError(error.message, error.status || 500);
        }

        throw new Error(error.message);
    }
)