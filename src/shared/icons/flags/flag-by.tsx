import { cn } from '@/shared/helpers/cn';

export default function FlagBY({ className }: { className?: string }) {
    return (
        <svg className={cn('h-4 w-6 shrink-0 overflow-hidden rounded-[2px]', className)} viewBox="0 0 24 16" aria-hidden>
            <rect width="24" height="16" fill="#fff" />
            <rect width="24" height="10" fill="#c8313e" />
            <rect y="10" width="24" height="6" fill="#4aa657" />
            <rect width="4" height="16" fill="#fff" />
            <path d="M0.5 1l1 1-1 1zM2.5 1l1 1-1 1zM0.5 4l1 1-1 1zM2.5 4l1 1-1 1zM0.5 7l1 1-1 1zM2.5 7l1 1-1 1zM0.5 10l1 1-1 1zM2.5 10l1 1-1 1zM0.5 13l1 1-1 1zM2.5 13l1 1-1 1z" fill="#c8313e" />
        </svg>
    );
}
