import type { ReactNode } from 'react'

type ProfileRowProps = {
    label: string
    value: ReactNode
    action?: ReactNode
}

/**
 * Строка «Личных данных»: подпись слева, значение и действие справа.
 * На телефоне подпись уезжает над значением — иначе email с бейджем не влезает.
 */
export function ProfileRow({ label, value, action }: ProfileRowProps) {
    return (
        <div className="flex flex-col gap-1 border-b border-border py-3 last:border-0 sm:flex-row sm:items-center sm:gap-4 sm:py-2.5">
            <span className="shrink-0 text-sm text-text-faint sm:w-32">{label}</span>
            <div className="flex min-h-9 min-w-0 flex-1 items-center gap-3">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2.5 gap-y-1">{value}</div>
                {action}
            </div>
        </div>
    )
}
