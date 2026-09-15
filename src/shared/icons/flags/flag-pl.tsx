import { cn } from '@/shared/helpers/cn';

export default function FlagPL({ className }: { className?: string }) {
    return (
        <svg className={cn('h-4 w-6 shrink-0 overflow-hidden rounded-[2px]', className)} viewBox="0 0 24 16" aria-hidden>
            <rect width="24" height="8" fill="#fff" />
            <rect y="8" width="24" height="8" fill="#dc143c" />
        </svg>
    );
}
