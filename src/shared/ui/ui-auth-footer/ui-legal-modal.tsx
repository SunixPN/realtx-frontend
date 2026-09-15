'use client';

import { forwardRef, useEffect } from 'react';
import type { TransitionStatus } from 'react-transition-group';
import { IconX } from '@/shared/ui/ui-icons';

export type LegalType = 'terms' | 'privacy';

const TERMS = (
    <div className="space-y-4 text-sm leading-relaxed text-text-base">
        <p>
            RealtX — агрегатор объявлений с&nbsp;сайта realt.by. Мы не&nbsp;являемся участником сделок
            купли-продажи или аренды недвижимости и не несём ответственности за содержание объявлений
            третьих лиц.
        </p>
        <h3 className="font-semibold text-text-base">1. Аккаунт</h3>
        <p>
            Регистрируясь, вы подтверждаете, что вам исполнилось 18&nbsp;лет. Один человек может
            создать один аккаунт. Вы несёте ответственность за сохранность учётных данных.
        </p>
        <h3 className="font-semibold text-text-base">2. Использование сервиса</h3>
        <p>
            Сервис предназначен исключительно для личного некоммерческого использования. Запрещено
            автоматически собирать данные, перепродавать доступ, размещать ложную информацию или
            нарушать работу платформы.
        </p>
        <h3 className="font-semibold text-text-base">3. Контент</h3>
        <p>
            Объявления агрегируются с&nbsp;realt.by. Актуальность, точность и&nbsp;полнота информации
            зависят от&nbsp;источника. Проверяйте данные перед принятием решений.
        </p>
        <h3 className="font-semibold text-text-base">4. Изменение условий</h3>
        <p>
            Мы можем обновить эти условия. О&nbsp;существенных изменениях уведомим по&nbsp;электронной
            почте не&nbsp;позднее чем за&nbsp;7&nbsp;дней.
        </p>
        <h3 className="font-semibold text-text-base">5. Прекращение доступа</h3>
        <p>
            Мы вправе заблокировать аккаунт при нарушении настоящих условий. Вы можете удалить
            аккаунт в&nbsp;любой момент в&nbsp;разделе настроек профиля.
        </p>
    </div>
);

const PRIVACY = (
    <div className="space-y-4 text-sm leading-relaxed text-text-base">
        <p>
            Мы собираем только те данные, которые необходимы для работы сервиса. Мы не&nbsp;продаём
            и не передаём их третьим лицам в&nbsp;коммерческих целях.
        </p>
        <h3 className="font-semibold text-text-base">1. Какие данные мы собираем</h3>
        <ul className="list-disc space-y-1 pl-4 text-text-muted">
            <li>Адрес электронной почты или номер телефона (при регистрации)</li>
            <li>Данные Google-аккаунта — только имя и email (при входе через Google)</li>
            <li>История просмотров объявлений и список избранного</li>
            <li>Настройки подписок и уведомлений</li>
        </ul>
        <h3 className="font-semibold text-text-base">2. Как мы используем данные</h3>
        <ul className="list-disc space-y-1 pl-4 text-text-muted">
            <li>Авторизация и защита аккаунта</li>
            <li>Сохранение избранного и подписок между устройствами</li>
            <li>Уведомления об изменениях цен по подпискам</li>
        </ul>
        <h3 className="font-semibold text-text-base">3. Хранение данных</h3>
        <p>
            Данные хранятся на&nbsp;защищённых серверах. Сессии истекают автоматически.
            При удалении аккаунта все персональные данные удаляются в&nbsp;течение&nbsp;30&nbsp;дней.
        </p>
        <h3 className="font-semibold text-text-base">4. Ваши права</h3>
        <p>
            Вы можете запросить экспорт или удаление своих данных в&nbsp;любое время, написав нам
            или воспользовавшись настройками профиля.
        </p>
        <h3 className="font-semibold text-text-base">5. Cookie</h3>
        <p>
            Мы используем cookie только для поддержания сессии и не применяем рекламные трекеры.
        </p>
    </div>
);

const CONTENT: Record<LegalType, { title: string; body: React.ReactNode }> = {
    terms: { title: 'Условия использования', body: TERMS },
    privacy: { title: 'Политика конфиденциальности', body: PRIVACY },
};

const STYLES: Partial<Record<TransitionStatus, string>> = {
    entering: 'opacity-100 translate-y-0 sm:scale-100',
    entered:  'opacity-100 translate-y-0 sm:scale-100',
    exiting:  'opacity-0 translate-y-4 sm:translate-y-0',
    exited:   'opacity-0 translate-y-4 sm:translate-y-0',
};

const BACKDROP_STYLES: Partial<Record<TransitionStatus, string>> = {
    entering: 'opacity-100',
    entered:  'opacity-100',
    exiting:  'opacity-0',
    exited:   'opacity-0',
};

type Props = {
    type: LegalType;
    state: TransitionStatus;
    onClose: () => void;
};

const UILegalModal = forwardRef<HTMLDivElement, Props>(function UILegalModal({ type, state, onClose }, ref) {
    const { title, body } = CONTENT[type];

    // Body scroll lock
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    // Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
        >
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ease-out ${BACKDROP_STYLES[state] ?? ''}`}
                onClick={onClose}
            />

            <div
                className={`relative z-10 flex w-full max-w-lg flex-col rounded-t-2xl border border-border bg-surface-raised shadow-2xl transition-[opacity,transform] duration-200 ease-out sm:rounded-2xl ${STYLES[state] ?? ''}`}
                style={{ maxHeight: '80dvh' }}
            >
                <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
                    <h2 id="legal-modal-title" className="text-sm font-semibold text-text-base">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-text-faint transition-colors hover:bg-surface-subtle hover:text-text-muted"
                        aria-label="Закрыть"
                    >
                        <IconX size={16} />
                    </button>
                </div>

                <div className="relative min-h-0 flex-1">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-surface-raised to-transparent" />
                    <div className="overflow-y-auto px-6 py-5">
                        {body}
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-5 from-surface-raised to-transparent" />
                </div>
            </div>
        </div>
    );
});

export default UILegalModal;
