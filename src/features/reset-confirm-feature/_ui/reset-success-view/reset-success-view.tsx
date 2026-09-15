import Link from 'next/link';
import { IconCheck } from '@/shared/ui/ui-icons';
import { ROUTES } from '@/shared/const/routes';

export default function ResetSuccessView() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 pb-2 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-success/10 text-success">
                    <IconCheck size={28} strokeWidth={3} />
                </span>
                <h1 className="text-2xl font-semibold text-text-base">Пароль обновлён</h1>
                <p className="max-w-sm text-sm text-text-muted">
                    Новый пароль сохранён. Войдите с ним, чтобы продолжить —
                    остальные сессии мы уже закрыли.
                </p>
            </div>

            <Link
                href={ROUTES.SIGN_IN}
                className="flex h-11 items-center justify-center rounded-md bg-brand text-sm font-medium text-white hover:bg-brand-hover"
            >
                Перейти ко входу
            </Link>
        </div>
    );
}
