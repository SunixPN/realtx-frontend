'use client'

// Спиннер-бейдж в правом верхнем углу карты. При открытом drawer'е
// смещается влево на его ширину (420px) + отступ (16px) — поверх блюра.
export function MapLoadingBadge({ drawerOpen }: { drawerOpen: boolean }) {
    return (
        <div
            className="absolute top-4 z-[60] transition-[right] duration-[320ms]"
            style={{
                right: drawerOpen ? 436 : 16,
                transitionTimingFunction: 'cubic-bezier(.25, 1, .5, 1)',
            }}
        >
            <div className="flex size-10 items-center justify-center rounded-full bg-surface-page shadow-md border border-border">
                <svg
                    className="size-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-label="Загрузка"
                >
                    <circle
                        cx="12" cy="12" r="9"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-brand opacity-20"
                    />
                    <path
                        d="M21 12A9 9 0 0 0 12 3"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="text-brand"
                    />
                </svg>
            </div>
        </div>
    )
}
