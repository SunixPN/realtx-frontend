import { cn } from '@/shared/helpers/cn';
export default function FlagRU({ className }: { className?: string }) {
    return (
        <svg className={cn('h-4 w-6 shrink-0 overflow-hidden rounded-[2px]', className)} viewBox="0 0 24 16" aria-hidden>
            <rect width="24" height="16" fill="#fff" />
            <rect y="5.33" width="24" height="5.33" fill="#0039a6" />
            <rect y="10.67" width="24" height="5.33" fill="#d52b1e" />
        </svg>
    );
}
