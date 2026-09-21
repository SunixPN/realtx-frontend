import Link from 'next/link';
import { IconMail } from '@/shared/ui/ui-icons';
type UIExpiredLinkProps = {
    title:       string;
    subtitle:    string;
    actionLabel: string;
    actionHref:  string;
};
export function UIExpiredLink({ title, subtitle, actionLabel, actionHref }: UIExpiredLinkProps) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 py-2 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-error/10 text-error xs:size-14">
                    <IconMail size={26} />
                </span>
                <h1 className="text-xl font-semibold text-text-base xs:text-2xl">{title}</h1>
                <p className="max-w-sm text-sm text-text-muted">{subtitle}</p>
            </div>
            <Link
                href={actionHref}
                className="flex h-11 items-center justify-center rounded-md bg-brand text-sm font-medium text-white hover:bg-brand-hover"
            >
                {actionLabel}
            </Link>
        </div>
    );
}
