import { cn } from '@/shared/helpers/cn'
const BYN_GLYPH = ''

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

export const BYN_SIGN_HTML =
    `<span aria-label="Br" style="font-family:'nbrb',sans-serif;font-style:normal;line-height:1;margin-left:0.15em;display:inline-block">&#xE901;</span>`
