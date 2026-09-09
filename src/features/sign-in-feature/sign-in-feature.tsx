'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UIInput } from '@/shared/ui/ui-input';
import { UIButton } from '@/shared/ui/ui-button';
import { IconEye, IconEyeOff, IconPhone } from '@/shared/ui/ui-icons';
import { ROUTES } from '@/shared/const/routes';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Введите email')
    .email('Некорректный email'),
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(8, 'Минимум 8 символов'),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInFeature() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: SignInValues) => {
    // TODO: интеграция с бэком
    console.log('signin', values);
    await new Promise((r) => setTimeout(r, 500));
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-surface-subtle">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px]">
          <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface-raised p-8">
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              <UIInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <div>
                <UIInput
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Минимум 8 символов"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      className="flex size-6 cursor-pointer items-center justify-center text-text-faint hover:text-text-base"
                    >
                      {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </button>
                  }
                  {...register('password')}
                />
                <div className="mt-1.5 text-right">
                  <Link
                    href="/reset"
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    Забыли пароль?
                  </Link>
                </div>
              </div>

              <UIButton type="submit" size="lg" fullWidth loading={isSubmitting}>
                Войти
              </UIButton>
            </form>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-text-faint">или через</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="flex h-11 cursor-pointer items-center justify-center gap-2.5 rounded-md border border-border-strong bg-surface-raised text-sm font-medium text-text-base hover:bg-surface-subtle"
              >
                <GoogleGlyph />
                Продолжить с Google
              </button>
              <button
                type="button"
                className="flex h-11 cursor-pointer items-center justify-center gap-2.5 rounded-md border border-border-strong bg-surface-raised text-sm font-medium text-text-base hover:bg-surface-subtle"
              >
                <IconPhone size={16} className="text-text-muted" />
                По номеру телефона
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-text-faint">
            RealtX — агрегатор объявлений с realt.by. Мы не участвуем в сделках,
            аккаунт нужен только для сохранения избранного и подписок.
          </p>
        </div>
      </main>

      <footer className="border-t border-border bg-surface-raised px-4 py-4 text-center text-xs text-text-faint">
        Продолжая, вы соглашаетесь с{' '}
        <a href="#" className="underline hover:text-text-muted">
          условиями использования
        </a>{' '}
        и{' '}
        <a href="#" className="underline hover:text-text-muted">
          политикой конфиденциальности
        </a>
      </footer>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
