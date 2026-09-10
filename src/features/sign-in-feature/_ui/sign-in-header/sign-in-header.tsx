import Link from "next/link";
import {ROUTES} from "@/shared/const/routes";

export default function SignInHeader() {
    return (
        <header>
            <h1 className="text-2xl font-semibold text-text-base">Вход</h1>
            <p className="mt-1.5 text-sm text-text-muted">
                Нет аккаунта?{' '}
                <Link
                    href={ROUTES.REGISTER}
                    className="font-medium text-brand hover:underline"
                >
                    Создать
                </Link>
            </p>
        </header>
    )
}