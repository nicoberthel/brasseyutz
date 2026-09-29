import type { CSSProperties, ReactNode } from 'react';
import {
  // pictos du design system (icon-catalog.ts)
  Hop, Wheat, FlaskConical, Droplets, Beer, Coffee,
  Citrus, Cherry, Grape, Apple, Leaf, Sprout, Flower2, TreePine, Clover, TreePalm,
  Sun, Moon, SunMoon, Snowflake, Cloud, Zap, Flame, Waves, Mountain, Sparkles, Orbit, Rocket,
  Terminal, Code, Cpu, Bug, Wifi, BatteryCharging, Save, Binary, InfinityIcon,
  Crown, Heart, Gift, Skull, Ghost, Anchor, Castle, Bomb, Book, Medal,
  // icônes d'interface
  Thermometer, Search, ArrowLeft, Printer,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Hop, Wheat, FlaskConical, Droplets, Beer, Coffee,
  Citrus, Cherry, Grape, Apple, Leaf, Sprout, Flower2, TreePine, Clover, TreePalm,
  Sun, Moon, SunMoon, Snowflake, Cloud, Zap, Flame, Waves, Mountain, Sparkles, Orbit, Rocket,
  Terminal, Code, Cpu, Bug, Wifi, BatteryCharging, Save, Binary, InfinityIcon,
  Crown, Heart, Gift, Skull, Ghost, Anchor, Castle, Bomb, Book, Medal,
  Thermometer, Search, ArrowLeft, Printer,
};

/* Pictos dessinés maison (absents de Lucide) — même grille 24 × 24, trait seul. */
const CUSTOM: Record<string, ReactNode> = {
  Fraise: <>
    <path d="M12 8.2c4.3 0 6.3 2.1 6.3 4.8 0 3.9-2.9 8-6.3 8s-6.3-4.1-6.3-8c0-2.7 2-4.8 6.3-4.8Z" />
    <path d="M12 8.2C10.9 6.4 9.2 5.5 7.2 5.5 8.3 3.8 10 3.1 12 3.1s3.7.7 4.8 2.4c-2 0-3.7.9-4.8 2.7Z" />
    <path d="M9.6 12.6h.01" /><path d="M14.4 12.6h.01" /><path d="M12 15.4h.01" /><path d="M10.2 18h.01" /><path d="M13.8 18h.01" />
  </>,
  Framboise: <>
    <path d="M12 3.4v2.4" />
    <path d="M12 5.8c1.2-1.3 2.8-2 4.6-1.8-.3 1.5-1.2 2.6-2.4 3.2" />
    <circle cx="9.5" cy="10.3" r="2.1" /><circle cx="14.5" cy="10.3" r="2.1" />
    <circle cx="7.4" cy="14.3" r="2.1" /><circle cx="12" cy="13.8" r="2.1" /><circle cx="16.6" cy="14.3" r="2.1" />
    <circle cx="9.7" cy="18.1" r="2.1" /><circle cx="14.3" cy="18.1" r="2.1" />
  </>,
  Abeille: <>
    <path d="M12 8.8c2.6 0 4.2 1.9 4.2 4.8s-1.6 6.4-4.2 6.4-4.2-3.5-4.2-6.4 1.6-4.8 4.2-4.8Z" />
    <path d="M8.2 12.4h7.6" /><path d="M8.3 15.5h7.4" />
    <path d="M9.5 9.1C6.6 8.4 5 6.3 6.8 4.9c1.8-1.3 4 .8 4.6 3.2" />
    <path d="M14.5 9.1c2.9-.7 4.5-2.8 2.7-4.2-1.8-1.3-4 .8-4.6 3.2" />
  </>,
};

export const ICON_NAMES = [...Object.keys(ICONS), ...Object.keys(CUSTOM)];

export interface CuveeIconProps {
  name?: string;
  size?: number;
  color?: string;
  stroke?: number;
  unit?: 'px' | 'mm';
  src?: string;
  style?: CSSProperties;
}

/* Icône Lucide au trait fin — illustration « simple » de cuvée.
   `src` (SVG/image uploadé) prime sur `name`. */
export function CuveeIcon({ name = 'Hop', size = 24, color = 'currentColor', stroke = 1.25, unit = 'px', src, style }: CuveeIconProps) {
  const s = size + unit;
  if (src) return <img src={src} alt="" style={{ height: s, width: 'auto', display: 'block', ...style }} />;
  if (CUSTOM[name]) {
    return <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', width: s, height: s, ...style }}>{CUSTOM[name]}</svg>;
  }
  const Icon = ICONS[name];
  if (!Icon) return <span style={{ display: 'inline-block', width: s, height: s, border: '1px dashed var(--encre-3)', boxSizing: 'border-box', ...style }} title={'Icône ' + name} />;
  return <Icon aria-hidden color={color} strokeWidth={stroke} style={{ display: 'block', width: s, height: s, ...style }} />;
}
