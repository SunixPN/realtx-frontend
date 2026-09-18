import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { mutate as swrMutate } from 'swr'
import { api, ApiError } from '@/shared/api/api'
import { TOKENS } from '@/shared/const/tokens'
import { API_ROUTES } from '@/shared/const/api-routes'
import { refreshRequest } from './refresh-request'
import { saveAccessTokenAction } from '@/shared/actions/save-access-token-action'
import { clearTokensAction } from '@/shared/actions/clear-tokens-action'
import { authKey } from './auth-query'
import readCookieAction from "@/shared/actions/read-cookie-action";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let isRefreshing = false
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processPending(token: string | null, err?: unknown) {
    pendingQueue.forEach(p => (token ? p.resolve(token) : p.reject(err)))
    pendingQueue = []
}

function buildApiError(error: AxiosError): ApiError | Error {
    const msg = (error.response?.data as { error?: { message?: string[] } })?.error?.message
    if (msg) return new ApiError(msg.join(','), error.response?.status ?? 500)
    return new ApiError(error.message, error.response?.status ?? 500)
}

// Запрос — вставляем access_token из куки. Для refresh-эндпоинта не добавляем —
// бэкенд отклоняет запрос если в Authorization истёкший токен.
api.interceptors.request.use(async (config) => {
    if (typeof window === 'undefined') return config
    if (config.url?.includes(API_ROUTES.AUTH.REFRESH)) return config
    const token = await readCookieAction(TOKENS.ACCESS_TOKEN)
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
    return config
})

// Ответ — при 401 рефрешим, при провале рефреша — логаут
api.interceptors.response.use(
    response => response,
    async (error: unknown) => {
        if (!(error instanceof AxiosError)) throw new Error(String(error))

        const originalRequest = error.config as RetryConfig | undefined

        if (
            typeof window === 'undefined' ||
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH)
            || originalRequest.url?.includes(API_ROUTES.AUTH.LOGIN)
            || originalRequest.url?.includes(API_ROUTES.AUTH.REGISTER)
        ) {
            throw buildApiError(error)
        }

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                pendingQueue.push({ resolve, reject })
            }).then(token => {
                originalRequest.headers.set('Authorization', `Bearer ${token}`)
                return api(originalRequest)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            const { data } = await refreshRequest()
            const newToken = data.accessToken

            await saveAccessTokenAction(newToken)

            processPending(newToken)
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`)
            return api(originalRequest)
        } catch (refreshError) {
            console.log(refreshError, "ERRO")
            // processPending(null, refreshError)
            // await clearTokensAction()
            // swrMutate(authKey, null, { revalidate: false })
            // window.location.href = '/sign-in'
            // throw new ApiError('Unauthorized', 401)
        } finally {
            isRefreshing = false
        }
    },
)
