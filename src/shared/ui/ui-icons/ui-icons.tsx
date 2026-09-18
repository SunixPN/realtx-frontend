import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const baseProps = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export function IconChevronDown({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconCheck({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)} strokeWidth={3}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconX({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function IconMenu({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconInfo({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export function IconAlertTriangle({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M12 2 2 20h20L12 2zM12 9v4M12 17h.01" />
    </svg>
  );
}

export function IconCheckCircle({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconEye({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconEyeOff({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-6.5 0-10-7-10-7a19.6 19.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a19.6 19.6 0 0 1-2.16 3.19M14.12 14.12a3 3 0 0 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

export function IconMoon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function IconSun({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function IconMonitor({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function IconHeart({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function IconBell({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function IconGitCompare({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7M11 18H8a2 2 0 0 1-2-2V9" />
    </svg>
  );
}

export function IconPhone({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function IconMail({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export function IconLoader({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)} className={`animate-spin ${props.className ?? ''}`}>
      <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
    </svg>
  );
}

export function IconUser({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IconClock({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export function IconLogOut({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function IconArrowLeft({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function IconKey({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <circle cx="8" cy="15" r="4" />
      <path d="M10.85 12.15 19 4" />
      <path d="m18 5 2 2" />
      <path d="m15 8 2 2" />
    </svg>
  );
}
