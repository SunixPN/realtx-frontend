import {useQuery} from "@tanstack/react-query";
import {authQuery} from "@/entities/me/api/auth-query";

export const useUser = () => {
    const { data: auth } = useQuery(authQuery)
    if (!auth) throw new Error("useUser must be provide inside PageSkeletonProvider")

    return auth
}