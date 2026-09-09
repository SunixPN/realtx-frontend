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

export function IconLoader({ size = 16, ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)} className={`animate-spin ${props.className ?? ''}`}>
      <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
    </svg>
  );
}
