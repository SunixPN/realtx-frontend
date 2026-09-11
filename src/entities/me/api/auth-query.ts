import {queryOptions} from "@tanstack/react-query";
import {QUERIES} from "@/shared/const/queries";
import {refreshRequest} from "@/entities/me/api/refresh-request";

export const authQuery = queryOptions({
    queryKey: [QUERIES.AUTH_QUERY],
    queryFn: async () => {
        const { data } = await refreshRequest();
        return {
            accessToken: data.accessToken,
            user: data.user
        }
    },

    staleTime: Infinity,
    gcTime: Infinity
})