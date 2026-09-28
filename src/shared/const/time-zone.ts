// Единый часовой пояс для форматирования дат. Сервер (SSR) на проде работает в UTC,
// браузер — в поясе пользователя; без явного timeZone даты около полуночи расходятся
// и React падает с hydration mismatch (#418).
export const APP_TIME_ZONE = 'Europe/Minsk'
