import type { ComponentType } from 'react';
import { FlagBY, FlagRU, FlagUA, FlagPL } from '@/shared/icons/flags';

export type CountryCode = '+375' | '+7' | '+380' | '+48';

export type FlagIcon = ComponentType<{ className?: string }>;

export type Country = {
    code:  CountryCode;
    short: string;      // BY / RU / UA / PL — для чипа-триггера
    name:  string;
    flag:  FlagIcon;
    mask:  string;      // '#' = цифра, остальное — разделители
};

export const COUNTRIES: readonly Country[] = [
    { code: '+375', short: 'BY', name: 'Беларусь', flag: FlagBY, mask: '## ### ## ##'  },
    { code: '+7',   short: 'RU', name: 'Россия',   flag: FlagRU, mask: '### ### ## ##' },
    { code: '+380', short: 'UA', name: 'Украина',  flag: FlagUA, mask: '## ### ## ##'  },
    { code: '+48',  short: 'PL', name: 'Польша',   flag: FlagPL, mask: '### ### ###'   },
] as const;

export const DEFAULT_COUNTRY_CODE: CountryCode = '+375';

export const getCountry = (code: string): Country =>
    COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0]!;
