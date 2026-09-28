import type { CSSProperties } from 'react';
import {
  // pictos du design system (icon-catalog.ts)
  Hop, Wheat, FlaskConical, Droplets, Beer, Coffee,
  Citrus, Cherry, Grape, Apple, Leaf, Sprout, Flower2, TreePine, Clover,
  Sun, Moon, SunMoon, Snowflake, Cloud, Zap, Flame, Waves, Mountain, Sparkles, Orbit, Rocket,
  Terminal, Code, Cpu, Bug, Wifi, BatteryCharging, Save, Binary, InfinityIcon,
  Crown, Heart, Gift, Skull, Ghost, Anchor, Castle, Bomb,
  // icônes d'interface
  Thermometer, Search, ArrowLeft, Printer,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Hop, Wheat, FlaskConical, Droplets, Beer, Coffee,
  Citrus, Cherry, Grape, Apple, Leaf, Sprout, Flower2, TreePine, Clover,
  Sun, Moon, SunMoon, Snowflake, Cloud, Zap, Flame, Waves, Mountain, Sparkles, Orbit, Rocket,
  Terminal, Code, Cpu, Bug, Wifi, BatteryCharging, Save, Binary, InfinityIcon,
  Crown, Heart, Gift, Skull, Ghost, Anchor, Castle, Bomb,
  Thermometer, Search, ArrowLeft, Printer,
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

/* Icône Lucide au trait fin — illustration « simple » de cuvée.
   `src` (SVG/image uploadé) prime sur `name`. */
export function CuveeIcon({ name = 'Hop', size = 24, color = 'currentColor', stroke = 1.25, unit = 'px', src, style }: CuveeIconProps) {
  const s = size + unit;
  if (src) return <img src={src} alt="" style={{ height: s, width: 'auto', display: 'block', ...style }} />;
  const Icon = ICONS[name];
  if (!Icon) return <span style={{ display: 'inline-block', width: s, height: s, border: '1px dashed var(--encre-3)', boxSizing: 'border-box', ...style }} title={'Icône ' + name} />;
  return <Icon aria-hidden color={color} strokeWidth={stroke} style={{ display: 'block', width: s, height: s, ...style }} />;
}
