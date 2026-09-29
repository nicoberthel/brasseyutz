/* Les 44 pictos du design system (assets/pictos, extraits de Lucide, trait 1,25),
   groupes et libellés français d'origine. Valeur stockée = nom du composant Lucide. */

export type IconEntry = [lucide: string, label: string];

export const ICON_GROUPS: { group: string; icons: IconEntry[] }[] = [
  {
    group: 'Ingrédients',
    icons: [
      ['Hop', 'Houblon'], ['Wheat', 'Épi'], ['FlaskConical', 'Levure'],
      ['Droplets', 'Eau'], ['Beer', 'Bière'], ['Coffee', 'Café'],
    ],
  },
  {
    group: 'Fruits & plantes',
    icons: [
      ['Citrus', 'Agrume'], ['Cherry', 'Cerise'], ['Grape', 'Raisin'],
      ['Apple', 'Pomme'], ['Leaf', 'Feuille'], ['Sprout', 'Pousse'],
      ['Flower2', 'Fleur'], ['TreePine', 'Sapin'], ['Clover', 'Trèfle'],
      ['Fraise', 'Fraise'], ['Framboise', 'Framboise'], ['TreePalm', 'Palmier'], ['Abeille', 'Abeille'],
    ],
  },
  {
    group: 'Saisons & ciel',
    icons: [
      ['Sun', 'Soleil'], ['Moon', 'Lune'], ['SunMoon', 'Mode sombre'],
      ['Snowflake', 'Flocon'], ['Cloud', 'Nuage'], ['Zap', 'Éclair'],
      ['Flame', 'Flamme'], ['Waves', 'Vagues'], ['Mountain', 'Montagne'],
      ['Sparkles', 'Étoiles'], ['Orbit', 'Orbite'], ['Rocket', 'Fusée'],
    ],
  },
  {
    group: 'Informatique',
    icons: [
      ['Terminal', 'Terminal'], ['Code', 'Code'], ['Cpu', 'CPU'],
      ['Bug', 'Bug'], ['Wifi', 'Wifi'], ['BatteryCharging', 'Batterie'],
      ['Save', 'Disquette'], ['Binary', 'Binaire'], ['InfinityIcon', 'Boucle'],
    ],
  },
  {
    group: 'Fête & divers',
    icons: [
      ['Crown', 'Couronne'], ['Heart', 'Cœur'], ['Gift', 'Cadeau'],
      ['Skull', 'Crâne'], ['Ghost', 'Fantôme'], ['Anchor', 'Ancre'],
      ['Castle', 'Château'], ['Bomb', 'Bombe'], ['Book', 'Livre'], ['Medal', 'Médaille'],
    ],
  },
];
