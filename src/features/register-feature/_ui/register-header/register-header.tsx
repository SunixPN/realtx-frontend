import Link from 'next/link';
import { ROUTES } from '@/shared/const/routes';

export default function RegisterHeader() {
    return (
        <header>
            <h1 className="text-2xl font-semibold text-text-base">Создать аккаунт</h1>
            <p className="mt-1.5 text-sm text-text-muted">
                Уже есть?{' '}
                <Link href={ROUTES.SIGN_IN} className="font-medium text-brand hover:underline">
                    Войти
                </Link>
            </p>
        </header>
    );
}
