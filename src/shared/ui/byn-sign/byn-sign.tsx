import { cn } from '@/shared/helpers/cn'

const BYN_GLYPH = ''

/**
 * Официальный графический символ белорусского рубля (BYN).
 * У символа нет точки в Unicode — используется шрифт `nbrb` от Нацбанка РБ,
 * где глиф замаплен на PUA-кодпойнт U+E901. @font-face объявлен в globals.css.
 * Наследует цвет и размер от текущего текста (как евро/доллар).
 */
export function BynSign({ className }: { className?: string }) {
    return (
        <span
            aria-label="Br"
            role="img"
            className={cn('inline-block', className)}
            style={{ fontFamily: "'nbrb', sans-serif", fontStyle: 'normal', lineHeight: 1, marginLeft: '0.15em' }}
        >
            {BYN_GLYPH}
        </span>
    )
}

/**
 * HTML-строка символа для вставки через innerHTML (например, HTML-маркеры Mapbox).
 * Использует тот же шрифт `nbrb` и PUA-кодпойнт.
 */
export const BYN_SIGN_HTML =
    `<span aria-label="Br" style="font-family:'nbrb',sans-serif;font-style:normal;line-height:1;margin-left:0.15em;display:inline-block">&#xE901;</span>`
