const CDN_ORIGINAL_RE = /^https:\/\/cdn\.realt\.by\/img\/([0-9a-f-]+)$/

// В БД лежат оригиналы (см. backend/parser/utils/photo-url.ts), но для показа
// в UI это избыточно: главная картинка ~1000px не нуждается в 843КБ jpg,
// превью 64px тем более. CDN отдаёт готовые уменьшенные варианты по URL
// вида /img/<size>/<uuid> (webp). static.realt.by уменьшенного варианта без
// hash не предоставляет — там показываем оригинал.
function withSize(url: string, size: number): string {
    const m = CDN_ORIGINAL_RE.exec(url)
    if (!m) return url
    return `https://cdn.realt.by/img/${size}/${m[1]}`
}

// Главная картинка в слайдере: /img/80/ отдаёт webp ~152КБ (2338×1653) — это
// минимально возможный «крупный» вариант, любые бОльшие числа возвращают тот
// же файл, любые меньшие — заметно теряют детализацию.
export const getMainPhoto = (url: string) => withSize(url, 80)

// Превью 64px: /img/40/ отдаёт webp ~37КБ (226×160, пропорции ~4:3) — хватает
// с запасом даже под 2× DPR. /img/50/ меньше по весу, но квадратный crop.
export const getThumbPhoto = (url: string) => withSize(url, 40)
