import type { CSSProperties } from 'react';
import {
  Hop, Citrus, Zap, Cherry, Orbit, Leaf, Snowflake, SunMoon, Wheat,
  Terminal, Bug, Crown, FlaskConical, Droplets, Thermometer, Search,
  ArrowLeft, Printer, type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Hop, Citrus, Zap, Cherry, Orbit, Leaf, Snowflake, SunMoon, Wheat,
  Terminal, Bug, Crown, FlaskConical, Droplets, Thermometer, Search,
  ArrowLeft, Printer,
};
export const ICON_NAMES = Object.keys(ICONS);

export interface CuveeIconProps {
  name?: string;
  size?: number;
  color?: string;
  stroke?: number;
  unit?: 'px' | 'mm';
  src?: string;
  style?: CSSProperties;
}

/* Icône Lucide au trait fin — illustration « simple » de cuvée. */
export function CuveeIcon({ name = 'Hop', size = 24, color = 'currentColor', stroke = 1.25, unit = 'px', src, style }: CuveeIconProps) {
  const s = size + unit;
  if (src) return <img src={src} alt="" style={{ height: s, width: 'auto', display: 'block', ...style }} />;
  const Icon = ICONS[name];
  if (!Icon) return <span style={{ display: 'inline-block', width: s, height: s, border: '1px dashed var(--encre-3)', boxSizing: 'border-box', ...style }} title={'Icône ' + name} />;
  return <Icon aria-hidden color={color} strokeWidth={stroke} style={{ display: 'block', width: s, height: s, ...style }} />;
}
