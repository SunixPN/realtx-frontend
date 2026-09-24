// Популярные почтовые сервисы → ссылка на входящие. mailto: открывает создание письма, а не ящик.
const WEBMAIL: Record<string, string> = {
    'gmail.com': 'https://mail.google.com/mail/u/0/#inbox',
    'googlemail.com': 'https://mail.google.com/mail/u/0/#inbox',
    'yandex.ru': 'https://mail.yandex.ru',
    'yandex.by': 'https://mail.yandex.by',
    'ya.ru': 'https://mail.yandex.ru',
    'mail.ru': 'https://e.mail.ru/inbox',
    'inbox.ru': 'https://e.mail.ru/inbox',
    'list.ru': 'https://e.mail.ru/inbox',
    'bk.ru': 'https://e.mail.ru/inbox',
    'outlook.com': 'https://outlook.live.com/mail/',
    'hotmail.com': 'https://outlook.live.com/mail/',
    'live.com': 'https://outlook.live.com/mail/',
    'icloud.com': 'https://www.icloud.com/mail',
    'me.com': 'https://www.icloud.com/mail',
    'tut.by': 'https://mail.yandex.by',
}

export function webmailUrl(email: string | null | undefined): string | null {
    const domain = email?.split('@')[1]?.toLowerCase()
    return domain ? WEBMAIL[domain] ?? null : null
}
