/* @ds-bundle: {"format":4,"namespace":"BrasserieDeBasseYutzDesignSystem_49af69","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"BeerCard","sourcePath":"components/core/BeerCard.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"BeerLabel","sourcePath":"components/label/BeerLabel.jsx"},{"name":"CuveeIcon","sourcePath":"components/label/CuveeIcon.jsx"},{"name":"Gauge","sourcePath":"components/label/Gauge.jsx"},{"name":"IngredientGrid","sourcePath":"components/label/IngredientGrid.jsx"},{"name":"PictoSlot","sourcePath":"components/label/LegalMentions.jsx"},{"name":"LegalMentions","sourcePath":"components/label/LegalMentions.jsx"},{"name":"LogoMark","sourcePath":"components/label/Logo.jsx"},{"name":"Signature","sourcePath":"components/label/Logo.jsx"},{"name":"Logo","sourcePath":"components/label/Logo.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"2ee553dc9e8a","components/core/BeerCard.jsx":"34bc3ffe606c","components/core/Button.jsx":"63624916115a","components/label/BeerLabel.jsx":"656d608d20ed","components/label/CuveeIcon.jsx":"7a4c394ae399","components/label/Gauge.jsx":"c5cc706d755f","components/label/IngredientGrid.jsx":"300400c22c45","components/label/LegalMentions.jsx":"13d2597cfde2","components/label/Logo.jsx":"216843272150","impressions/doc-page.js":"f52ae9c02fca","outils/editeur/App.jsx":"8d748f0a0110","outils/editeur/Form.jsx":"fdaffc982241","outils/editeur/assets-v2.js":"348c0d72ff70","outils/editeur/pictos.js":"4c971c1f4fbb","ui_kits/etiquettes/Icon.jsx":"cb7e32b898dd","ui_kits/etiquettes/LegalChecklist.jsx":"88249acc0795","ui_kits/etiquettes/Sheet.jsx":"b2e34ffbe262","ui_kits/etiquettes/Sidebar.jsx":"a512c2ff1496","ui_kits/etiquettes/Studio.jsx":"2f1b777fa1d7","ui_kits/etiquettes/data.js":"106d2c27bd09","ui_kits/etiquettes/tweaks-panel.jsx":"d259e3a86f73"},"inlinedExternals":[],"unexposedExports":[{"name":"describe","sourcePath":"components/label/Gauge.jsx"},{"name":"level","sourcePath":"components/label/Gauge.jsx"}]} */

(() => {

const __ds_ns = (window.BrasserieDeBasseYutzDesignSystem_49af69 = window.BrasserieDeBasseYutzDesignSystem_49af69 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = 'outline',
  children,
  style
}) {
  const t = {
    ink: ['var(--encre)', 'var(--papier)', 'var(--encre)'],
    outline: ['transparent', 'var(--encre)', 'var(--encre)'],
    muted: ['var(--papier-2)', 'var(--encre-2)', 'transparent'],
    accent: ['transparent', 'var(--accent)', 'var(--accent)']
  }[tone] || ['transparent', 'var(--encre)', 'var(--encre)'];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 8px',
      background: t[0],
      color: t[1],
      border: `1px solid ${t[2]}`,
      font: '500 11px/1.3 var(--font-mono)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  disabled,
  onClick,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const sz = {
    sm: {
      padding: '6px 12px',
      fontSize: 12
    },
    md: {
      padding: '10px 18px',
      fontSize: 13
    },
    lg: {
      padding: '14px 26px',
      fontSize: 15
    }
  }[size];
  const v = {
    primary: {
      background: h ? 'var(--encre-2)' : 'var(--encre)',
      color: 'var(--papier)',
      border: '1px solid var(--encre)'
    },
    outline: {
      background: h ? 'var(--encre)' : 'transparent',
      color: h ? 'var(--papier)' : 'var(--encre)',
      border: '1px solid var(--encre)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--encre)',
      border: '1px solid transparent',
      textDecoration: h ? 'underline' : 'none',
      textUnderlineOffset: 4
    },
    accent: {
      background: h ? 'var(--encre)' : 'var(--accent)',
      color: 'var(--papier)',
      border: '1px solid transparent'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-text)',
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      borderRadius: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.35 : 1,
      transform: p ? 'translateY(1px)' : 'none',
      transition: 'background var(--dur-fast),color var(--dur-fast)',
      whiteSpace: 'nowrap',
      ...sz,
      ...v,
      ...style
    }
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/label/CuveeIcon.jsx
try { (() => {
/* Rend une icône Lucide (window.lucide, CDN) en SVG React. Illustration « simple » de cuvée. */
function CuveeIcon({
  name = 'Hop',
  size = 24,
  color = 'currentColor',
  stroke = 1.25,
  unit = 'px',
  src,
  style
}) {
  const s = size + unit;
  if (src) return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      height: s,
      width: 'auto',
      display: 'block',
      ...style
    }
  });
  const node = typeof window !== 'undefined' && window.lucide && window.lucide.icons && window.lucide.icons[name];
  if (!node) return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: s,
      height: s,
      border: '1px dashed var(--encre-3)',
      boxSizing: 'border-box',
      ...style
    },
    title: 'Icône ' + name + ' (charger lucide)'
  });
  const kids = node[2] || [];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: s,
    height: s,
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: 'block',
      ...style
    }
  }, kids.map(([t, a], i) => React.createElement(t, {
    key: i,
    ...a
  })));
}
Object.assign(__ds_scope, { CuveeIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/label/CuveeIcon.jsx", error: String((e && e.message) || e) }); }

// components/core/BeerCard.jsx
try { (() => {
function BeerCard({
  name,
  styleName,
  abv,
  ibu,
  ebc,
  brew,
  accent = 'var(--cuvee-orange)',
  icon = 'Hop',
  image,
  description,
  onClick
}) {
  const [h, setH] = React.useState(false);
  const w = String(name || '').split(' ');
  const a = w.slice(0, Math.ceil(w.length / 2)).join(' '),
    b = w.slice(Math.ceil(w.length / 2)).join(' ');
  const cell = {
    padding: '10px 14px',
    borderLeft: '1px solid var(--filet)'
  };
  const k = {
    font: '500 10px var(--font-mono)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)'
  };
  const v = {
    font: '400 24px/1.1 var(--font-display)',
    color: 'var(--text-strong)'
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: 'var(--surface-card)',
      border: `1px solid ${h ? 'var(--encre)' : 'var(--filet)'}`,
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 14px',
      borderBottom: '1px solid var(--filet)',
      font: '500 11px var(--font-mono)',
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, styleName), brew != null && /*#__PURE__*/React.createElement("span", null, "N\xB0 ", brew)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 16px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      textAlign: 'center'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      height: 56
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.CuveeIcon, {
    name: icon,
    size: 44,
    color: accent,
    stroke: 1.1
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 36px/0.95 var(--font-display)',
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)'
    }
  }, a, b && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("i", {
    style: {
      color: accent
    }
  }, b))), description && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px/1.45 var(--font-text)',
      color: 'var(--text-body)',
      maxWidth: 260,
      textWrap: 'pretty'
    }
  }, description)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      borderTop: '1px solid var(--filet)',
      marginTop: 'auto'
    }
  }, [['Alc.', String(abv).replace('.', ',') + ' %'], ['EBC', ebc], ['IBU', ibu]].map(([x, y], i) => /*#__PURE__*/React.createElement("div", {
    key: x,
    style: {
      ...cell,
      borderLeft: i ? cell.borderLeft : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: k
  }, x), /*#__PURE__*/React.createElement("div", {
    style: v
  }, y ?? '—')))));
}
Object.assign(__ds_scope, { BeerCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/BeerCard.jsx", error: String((e && e.message) || e) }); }

// components/label/Gauge.jsx
try { (() => {
const EBC = 'linear-gradient(90deg,var(--ebc-4),var(--ebc-8) 10%,var(--ebc-12) 15%,var(--ebc-20) 25%,var(--ebc-30) 37%,var(--ebc-45) 56%,var(--ebc-70) 87%,var(--ebc-100))';
const EBC_SEG = ['var(--ebc-4)', 'var(--ebc-12)', 'var(--ebc-20)', 'var(--ebc-45)', 'var(--ebc-100)'];
function level(kind, v) {
  return kind === 'ebc' ? v <= 10 ? 1 : v <= 16 ? 2 : v <= 30 ? 3 : v <= 60 ? 4 : 5 : v <= 15 ? 1 : v <= 30 ? 2 : v <= 45 ? 3 : v <= 70 ? 4 : 5;
}
function describe(kind, v) {
  if (kind === 'ebc') return v <= 10 ? 'Blonde' : v <= 16 ? 'Dorée' : v <= 30 ? 'Ambrée' : v <= 60 ? 'Brune' : 'Noire';
  return v <= 15 ? 'Légère' : v <= 30 ? 'Modérée' : v <= 45 ? 'Marquée' : v <= 70 ? 'Intense' : 'Extrême';
}
/* 5 segments (variant 'segments', défaut) : EBC = teintes de bière, IBU = couleur de cuvée. EBC variant 'gradient' = dégradé + repère. */
function Gauge({
  kind = 'ebc',
  value = 0,
  max,
  unit = 'px',
  accent = 'var(--accent)',
  variant = 'segments',
  showLabel = true,
  style
}) {
  const m = max ?? (kind === 'ebc' ? 80 : 100);
  const pct = Math.max(0, Math.min(100, value / m * 100));
  const u = v => v + unit;
  const mm = unit === 'mm';
  const h = mm ? 1.3 : 6;
  const fs = mm ? 2.2 : 11;
  const n = level(kind, value);
  const bar = kind === 'ebc' && variant === 'gradient' ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block',
      height: u(h),
      background: EBC
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: pct + '%',
      top: u(-h * 0.45),
      bottom: u(-h * 0.45),
      width: u(mm ? 0.45 : 2),
      marginLeft: u(mm ? -0.22 : -1),
      background: 'var(--encre)'
    }
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)',
      gap: u(mm ? 0.5 : 3),
      height: u(h)
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      background: i < n ? kind === 'ebc' ? EBC_SEG[i] : accent : 'var(--filet)'
    }
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: u(mm ? 0.9 : 5),
      ...style
    }
  }, showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: `500 ${u(fs)} var(--font-mono)`,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    }
  }, /*#__PURE__*/React.createElement("span", null, kind === 'ebc' ? 'Couleur' : 'Amertume'), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)'
    }
  }, kind.toUpperCase(), " ", value)), bar);
}
Object.assign(__ds_scope, { level, describe, Gauge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/label/Gauge.jsx", error: String((e && e.message) || e) }); }

// components/label/IngredientGrid.jsx
try { (() => {
const fmt = t => String(t || '').split(/(\*[^*]+\*)/g).map((p, i) => p.startsWith('*') ? /*#__PURE__*/React.createElement("b", {
  key: i,
  style: {
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    color: 'var(--text-strong)'
  }
}, p.slice(1, -1)) : p);
const ROWS = [['malts', 'Wheat', 'Malts'], ['hops', 'Hop', 'Houblons'], ['yeast', 'FlaskConical', 'Levure'], ['other', 'Droplets', 'Autres']];
/* Grille d'ingrédients : icône (Malts, Houblons, Levure, Autres) + liste. Allergènes entre *astérisques*. */
function IngredientGrid({
  malts,
  hops,
  yeast,
  other,
  unit = 'px',
  accent = 'var(--accent)',
  rowPadding,
  inset = 0,
  style
}) {
  const mm = unit === 'mm';
  const u = v => v + unit;
  const fs = mm ? 2.4 : 14;
  const ic = mm ? 3.6 : 20;
  const vals = {
    malts,
    hops,
    yeast,
    other
  };
  const rows = ROWS.filter(r => vals[r[0]]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `${u(ic + inset)} 1fr`,
      ...style
    }
  }, rows.map(([key, icon, label], i) => {
    const bt = i ? `${mm ? '0.15mm' : '1px'} solid var(--filet)` : 'none';
    const pad = `${u(rowPadding ?? (mm ? 1.3 : 8))} 0`;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: key
    }, /*#__PURE__*/React.createElement("span", {
      title: label,
      "aria-label": label,
      style: {
        padding: pad,
        paddingLeft: u(inset),
        borderTop: bt,
        display: 'flex',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.CuveeIcon, {
      name: icon,
      size: ic,
      unit: unit,
      color: accent,
      stroke: 1.5
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: `400 ${u(fs)}/1.28 var(--font-text)`,
        color: 'var(--text-body)',
        padding: pad,
        paddingLeft: u(mm ? 2.4 : 14),
        paddingRight: u(inset),
        borderTop: bt,
        textWrap: 'pretty'
      }
    }, fmt(vals[key])));
  }));
}
Object.assign(__ds_scope, { IngredientGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/label/IngredientGrid.jsx", error: String((e && e.message) || e) }); }

// components/label/LegalMentions.jsx
try { (() => {
function PictoSlot({
  src,
  label,
  size,
  u
}) {
  return src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: label,
    style: {
      height: u(size),
      width: 'auto',
      display: 'block',
      flex: 'none'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    title: label,
    style: {
      height: u(size),
      width: u(size),
      flex: 'none',
      border: `${u(size * 0.025)} dashed var(--encre-3)`,
      display: 'grid',
      placeItems: 'center',
      font: `500 ${u(size * 0.14)}/1.1 var(--font-mono)`,
      color: 'var(--encre-3)',
      textAlign: 'center',
      boxSizing: 'border-box',
      padding: u(size * 0.05)
    }
  }, label);
}
/* Bloc légal : tableau aligné (DDM / Lot / Embouteillée, valeurs mono à droite) + responsable et pictogrammes. */
function LegalMentions({
  lot,
  bestBefore,
  bottledOn,
  brewer = 'Brasse-Yutz',
  address = 'Yutz',
  pregnancySrc,
  trimanSrc,
  unit = 'px',
  homebrew = true,
  pictos = true,
  quiet = false,
  style
}) {
  const mm = unit === 'mm';
  const fs = mm ? 2.4 : 12;
  const u = v => v + unit;
  const line = `${mm ? '0.15mm' : '1px'} solid var(--filet)`;
  const tone = quiet ? 'var(--encre-2)' : 'var(--text-body)';
  const k = {
    font: `400 ${u(fs)}/1.2 var(--font-text)`,
    color: tone,
    padding: `${u(fs * (quiet ? 0.08 : 0.22))} 0`,
    whiteSpace: 'nowrap'
  };
  const v = {
    font: `${quiet ? 400 : 500} ${u(fs)}/1.2 var(--font-mono)`,
    color: quiet ? 'var(--encre-2)' : 'var(--text-strong)',
    textAlign: 'right',
    whiteSpace: 'nowrap',
    padding: `${u(fs * (quiet ? 0.08 : 0.22))} 0`
  };
  const rows = [['À consommer de préférence avant fin', bestBefore], ['Lot', lot], bottledOn && ['Embouteillée le', bottledOn]].filter(Boolean);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: u(fs * 0.35),
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: u(fs)
    }
  }, rows.map(([a, b], i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: a
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...k,
      borderTop: i && !quiet ? line : 'none'
    }
  }, a), /*#__PURE__*/React.createElement("span", {
    style: {
      ...v,
      borderTop: i && !quiet ? line : 'none'
    }
  }, b)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: u(fs * 0.6),
      borderTop: line,
      paddingTop: u(fs * 0.4)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      font: `400 ${u(fs)}/1.25 var(--font-text)`,
      color: tone,
      textWrap: 'pretty'
    }
  }, homebrew ? 'Bière maison · ' : '', brewer, ", ", address), pictos && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PictoSlot, {
    src: pregnancySrc,
    label: "Z\xE9ro alcool pendant la grossesse",
    size: fs * 2.9,
    u: u
  }), /*#__PURE__*/React.createElement(PictoSlot, {
    src: trimanSrc,
    label: "Info-tri Triman",
    size: fs * 2.9,
    u: u
  }))));
}
Object.assign(__ds_scope, { PictoSlot, LegalMentions });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/label/LegalMentions.jsx", error: String((e && e.message) || e) }); }

// components/label/Logo.jsx
try { (() => {
/* Marque B4 : mitre + barbe houblon en encre, croix de Lorraine découpée, anneau en couleur (marque : orange ; étiquette : couleur de cuvée).
   Signature « G » : logo, puis BRASSE / filet couleur / YUTZ justifiés à la même largeur, YUTZ plus grand. */
const sc = (x0, x1, y0, yb) => {
  const m = (x0 + x1) / 2,
    h = +((yb - y0) * .72 + y0).toFixed(2);
  return `M${x0} ${y0}Q${x0} ${h} ${m} ${yb}Q${x1} ${h} ${x1} ${y0}Z`;
};
const SCALES = [[80, 102, [[42, 58]]], [68, 88, [[35, 50], [50, 65]]], [58, 76, [[28, 42.7], [42.7, 57.3], [57.3, 72]]]].flatMap(([y0, yb, xs]) => xs.map(([a, b]) => sc(a, b, y0, yb)));
const MITRE = 'M30 52V36Q30 16 50 3Q70 16 70 36V52Z';
/* Sans masque : les découpes sont peintes à la couleur du fond (knock) → vectoriel net en PDF et en export PNG. */
function LogoMark({
  size = 48,
  unit = 'px',
  ring = 'var(--accent)',
  ink = 'var(--encre)',
  knock = 'var(--papier)',
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "7 0 86 105",
    role: "img",
    "aria-label": "Brasse-Yutz",
    style: {
      height: size + unit,
      width: 'auto',
      display: 'block',
      overflow: 'visible',
      ...style
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "58",
    r: "40",
    fill: "none",
    stroke: ring,
    strokeWidth: "2.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: MITRE,
    fill: ink,
    stroke: knock,
    strokeWidth: "5",
    paintOrder: "stroke"
  }), /*#__PURE__*/React.createElement("g", {
    fill: knock
  }, /*#__PURE__*/React.createElement("rect", {
    x: "48.4",
    y: "14",
    width: "3.2",
    height: "29"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "43.5",
    y: "20",
    width: "13",
    height: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "40.5",
    y: "28",
    width: "19",
    height: "3"
  })), SCALES.map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: d,
    fill: ink,
    stroke: knock,
    strokeWidth: "2.6",
    strokeLinejoin: "round"
  })));
}
const Just = ({
  txt,
  w,
  fs,
  unit,
  color
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    width: w + unit,
    font: `600 ${fs}${unit}/1 var(--font-text)`,
    textTransform: 'uppercase',
    color
  }
}, [...txt].map((l, i) => /*#__PURE__*/React.createElement("span", {
  key: i
}, l)));
function Signature({
  size = 48,
  unit = 'px',
  ring = 'var(--accent)',
  ink = 'var(--encre)',
  knock = 'var(--papier)',
  style
}) {
  const w = size * 1.62,
    g = size * 0.14;
  return /*#__PURE__*/React.createElement("span", {
    "aria-label": "Brasse-Yutz",
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: size * 0.14 + unit,
      ...style
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: size,
    unit: unit,
    ring: ring,
    ink: ink,
    knock: knock
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: size * 0.09 + unit
    }
  }, /*#__PURE__*/React.createElement(Just, {
    txt: "Brasse",
    w: w,
    fs: size * 0.26,
    unit: unit,
    color: ink
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: w + unit,
      height: Math.max(size * 0.05, 0.4) + unit,
      background: ring
    }
  }), /*#__PURE__*/React.createElement(Just, {
    txt: "Yutz",
    w: w,
    fs: size * 0.42,
    unit: unit,
    color: ink
  })));
}
function Logo({
  size = 48,
  inverse = false,
  lockup = false,
  ring = 'var(--accent)',
  style
}) {
  const ink = inverse ? 'var(--papier)' : 'var(--encre)';
  const knock = inverse ? 'var(--encre)' : 'var(--papier)';
  return lockup ? /*#__PURE__*/React.createElement(Signature, {
    size: size,
    ring: ring,
    ink: ink,
    knock: knock,
    style: style
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      ...style
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: size,
    ring: ring,
    ink: ink,
    knock: knock
  }));
}
Object.assign(__ds_scope, { LogoMark, Signature, Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/label/Logo.jsx", error: String((e && e.message) || e) }); }

// components/label/BeerLabel.jsx
try { (() => {
/* 140 × 75 mm — 75 cl et 33 cl long neck. Fond papier, une encre + une couleur de cuvée (« highlight »).
   Dos 60 mm : fiche technique. Face 80 mm : centrée, aérée, nom en serif. */
function BeerLabel({
  bottle = '75cl',
  name,
  edition,
  styleName,
  denomination,
  brew,
  abv,
  ebc,
  ibu,
  malts,
  hops,
  yeast,
  other,
  bottledOn,
  bestBefore,
  lot,
  accent = 'var(--cuvee-orange)',
  icon = 'Hop',
  artwork,
  monochrome = false,
  ingredientSpacing = 1.3,
  ebcDisplay = 'segments',
  ruleWidth = 62,
  ruleWeight = 0.8,
  logoSrc = 'assets/logo-brasse-yutz.svg',
  pregnancySrc,
  trimanSrc,
  brewer,
  address,
  scale = 1,
  showVisibleZone = false,
  style
}) {
  const vol = bottle === '33cl' ? '33 cl' : '75 cl';
  const abvTxt = String(abv).replace('.', ',');
  const ac = monochrome ? 'var(--encre)' : accent;
  const words = String(name || '').split(' ');
  const first = edition ? name : words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const second = edition || words.slice(Math.ceil(words.length / 2)).join(' ');
  const longest = Math.max(first.length, second.length);
  const nameSize = Math.min(12.5, 62 / (longest * 0.46));
  const hair = 'var(--label-hair) solid var(--encre)';
  const light = 'var(--label-hair-light) solid var(--filet)';
  const cap = {
    font: '600 1.9mm var(--font-text)',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)'
  };
  const num = {
    font: '400 4.8mm/1 var(--font-display)',
    color: 'var(--text-strong)',
    whiteSpace: 'nowrap'
  };
  const unitS = {
    font: '500 1.8mm var(--font-mono)',
    color: 'var(--text-muted)',
    marginLeft: '0.6mm'
  };
  const desc = {
    font: 'italic 400 2.7mm/1 var(--font-display)',
    color: ac,
    whiteSpace: 'nowrap'
  };
  const numRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '1mm',
    margin: '0.7mm 0 1mm'
  };
  const zone = bottle === '33cl' ? 50 : 64;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      zoom: scale,
      width: '140mm',
      height: '75mm',
      display: 'flex',
      background: 'var(--papier)',
      color: 'var(--text-body)',
      overflow: 'hidden',
      flex: 'none',
      position: 'relative',
      WebkitPrintColorAdjust: 'exact',
      printColorAdjust: 'exact',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '62mm',
      flex: 'none',
      borderRight: hair,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '2.6mm 3mm 1.6mm',
      borderBottom: hair
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 2.2mm var(--font-text)',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: ac,
      whiteSpace: 'nowrap'
    }
  }, styleName), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 2.2mm var(--font-mono)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, "N\xB0 ", brew, " \xB7 ", bottledOn)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '14mm 1fr 1fr',
      borderBottom: hair
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1.4mm 3mm'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: cap
  }, "Alc."), /*#__PURE__*/React.createElement("div", {
    style: {
      ...num,
      marginTop: '0.7mm'
    }
  }, abvTxt, /*#__PURE__*/React.createElement("span", {
    style: unitS
  }, "%"))), ebc != null && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1.4mm 2.4mm',
      borderLeft: light
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: cap
  }, "Couleur"), /*#__PURE__*/React.createElement("div", {
    style: numRow
  }, /*#__PURE__*/React.createElement("span", {
    style: num
  }, ebc, /*#__PURE__*/React.createElement("span", {
    style: unitS
  }, "EBC")), /*#__PURE__*/React.createElement("span", {
    style: desc
  }, __ds_scope.describe('ebc', ebc))), /*#__PURE__*/React.createElement(__ds_scope.Gauge, {
    kind: "ebc",
    value: ebc,
    unit: "mm",
    variant: ebcDisplay,
    showLabel: false
  })), ibu != null && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1.4mm 2.4mm',
      borderLeft: light
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: cap
  }, "Amertume"), /*#__PURE__*/React.createElement("div", {
    style: numRow
  }, /*#__PURE__*/React.createElement("span", {
    style: num
  }, ibu, /*#__PURE__*/React.createElement("span", {
    style: unitS
  }, "IBU")), /*#__PURE__*/React.createElement("span", {
    style: desc
  }, __ds_scope.describe('ibu', ibu))), /*#__PURE__*/React.createElement(__ds_scope.Gauge, {
    kind: "ibu",
    value: ibu,
    unit: "mm",
    accent: ac,
    showLabel: false
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.2mm 0 0',
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IngredientGrid, {
    unit: "mm",
    inset: 3,
    rowPadding: ingredientSpacing,
    accent: ac,
    malts: malts,
    hops: hops,
    yeast: yeast,
    other: other
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1.2mm 3mm 2mm',
      borderTop: light
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LegalMentions, {
    unit: "mm",
    quiet: true,
    lot: lot,
    bestBefore: bestBefore,
    brewer: brewer,
    address: address,
    pregnancySrc: pregnancySrc,
    trimanSrc: trimanSrc
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2.4mm 0 2.6mm',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Signature, {
    size: 9,
    unit: "mm",
    ring: ac,
    ink: "var(--encre)",
    style: {
      marginBottom: '2mm'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2.2mm',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.CuveeIcon, {
    name: icon,
    src: artwork,
    size: 12,
    unit: "mm",
    color: ac,
    stroke: 1.1
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: `400 ${nameSize}mm/0.92 var(--font-display)`,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, first, second && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("i", {
    style: {
      color: ac
    }
  }, second)))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: ruleWidth + 'mm',
      height: ruleWeight + 'mm',
      background: ac,
      display: 'block',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '50mm',
      paddingTop: '1.6mm',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 2.4mm var(--font-text)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, denomination || 'Bière ' + styleName, " \xB7 ", abvTxt, " % vol."), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 6.5mm/1 var(--font-display)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, vol)), showVisibleZone && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '-1mm',
      bottom: '-1mm',
      left: `calc(50% - ${zone / 2}mm)`,
      width: zone + 'mm',
      border: '0.4mm dashed var(--cuvee-bleu)',
      pointerEvents: 'none',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '1.6mm',
      left: '1.6mm',
      font: '600 2mm var(--font-mono)',
      background: 'var(--cuvee-bleu)',
      color: '#fff',
      padding: '0.4mm 1mm'
    }
  }, "visible ", vol, " \u2248 ", zone, " mm"))));
}
Object.assign(__ds_scope, { BeerLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/label/BeerLabel.jsx", error: String((e && e.message) || e) }); }

// impressions/doc-page.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <doc-page> — paged-document shell for printable HTML.
 *
 * FIRST, decide how the document paginates — up front, before building:
 *
 * - FLOWING document (the default): write the whole document as one
 *   normal HTML flow inside <doc-page>; the browser's print engine
 *   splits it onto pages at export. Use for long-form documents with a
 *   single text flow: reports, memos, letters, essays.
 * - EXPLICIT pagination: a fixed set of pre-paginated pages, one
 *   <section class="page"> child per page. Use when the user asks for a
 *   specific page count, or the design implies one: a one-page resume, a
 *   two-sided flier, a poster, a certificate, a brochure — any richly
 *   laid-out document without a single text flow.
 * - If in doubt, ask the user as part of the build.
 *
 * PAGE SIZING — paper differs by country (letter vs A4), so the printed
 * sheet is not one fixed truth:
 * - FLOWING documents pin NO paper size: the print engine paginates
 *   onto the user's real paper, and the content reflows to it.
 * - EXPLICITLY PAGINATED documents print each page at a FIXED page box
 *   with overflow hidden — letter by default, size="a4" for a clearly
 *   metric user, the user's chosen paper when they export. Design each
 *   page to FILL that box, fitting letter and A4 alike without overlap.
 * - width/height pin an explicit fixed size, ONLY when the user gives
 *   one.
 * Never write your own @page rule or hard-code paper dimensions in the
 * content.
 *
 * Sizing modes (attributes):
 *   (none)                      — portrait: flowing docs use the user's
 *           paper; explicitly paginated pages use the named size box
 *           (letter unless size="a4")
 *   orientation="landscape"     — the same, landscape
 *   width / height              — explicit fixed size, ONLY when the user
 *           gives one (e.g. width="22in" height="30in" for a 22×30
 *           poster): the page IS the design's size, printed at true
 *           dimensions (or scaled onto the user's paper at print time).
 *           Any absolute CSS length: px/in/mm/cm/pt/pc.
 * The component announces the chosen mode to the host app at runtime (a
 * meta tag it injects), so the print path can inject the user's true
 * paper size.
 *
 * On screen the document renders on a desk background: a flowing
 * document as one tall scrolling sheet (Google Docs' pageless view);
 * explicitly paginated documents as one card per page.
 *
 * EXPLICIT pagination usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page>
 *     <section class="page" id="p1">…one page's design…</section>
 *     <section class="page" id="p2">…</section>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * How the page box works, concretely: each .page prints as ONE full-bleed
 * sheet at a FIXED physical size — letter by default (set size="a4" for
 * a clearly metric user), the user's chosen paper when they export —
 * with overflow hidden. Nothing scrolls and nothing reflows onto a next
 * sheet: content that misses the box is CLIPPED. Design each page to
 * FILL that page box, and to fit it — letter and A4 alike — without
 * overlap. Each page is a size container; don't size anything in
 * viewport units (they track the window, not the page), and never set
 * width or height on the .page section itself (the component sizes the
 * page box; an authored height like 100% is meaningless at print and is
 * overridden). The component owns the page box, the screen card chrome,
 * and the page breaks (never add your own break-before/after). Don't mix
 * .page sections with flowing content or header/footer slots in the same
 * document.
 *
 * FLOWING usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page margin="0.75in">
 *     <h1>Title</h1>
 *     <p>…body…</p>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * There is no manual page-splitting — the browser's print engine
 * paginates at export. Standard break-hygiene rules (`break-inside:
 * avoid` on figures, code blocks, images and table rows; `orphans/
 * widows: 3`) are applied so paragraphs and groups split cleanly. On
 * screen and at print, headings default to `text-wrap: balance` and
 * body text to `text-wrap: pretty`; the defaults have zero specificity,
 * so any text-wrap you declare wins.
 *
 * Other attributes:
 *   size    — letter | a4 | legal (default letter). Flowing documents:
 *           preview proportion only — it does NOT pin their printed
 *           paper (the print dialog's paper governs); leave it alone
 *           there. Explicitly paginated documents: it sets the page box
 *           the cards and the pinned @page share (the export dialog's
 *           choice overrides both at print) — set size="a4" for a
 *           clearly metric user. Scaled-fit: names the sheet the fit is
 *           computed against, same a4-for-metric-users advice.
 *   content-width / content-height — the design's own fixed dimensions
 *           (CSS lengths), for scaling a fixed-size design ONTO the
 *           named sheet: content lays out at exactly this size, and the
 *           component scales it to fit that sheet's printable area
 *           (centered horizontally, top-aligned; the export dialog
 *           re-fits to the user's actual paper choice where available).
 *           Both must be set; they do not change the page box. For pages
 *           WITHOUT running header/footer slots.
 *   margin  — printable inset on every page of a FLOWING document
 *           (default 0.75in); margin="0" makes pages full-bleed.
 *           Explicitly paginated pages are always full-bleed.
 *
 * Running header/footer (flowing documents only): give an element
 * `slot="header"` or `slot="footer"` and it repeats on every printed
 * page via `position: fixed`. To keep body text from sliding under it,
 * the component prints inside a single-cell table whose <thead>/<tfoot>
 * are spacers sized to the header/footer height — browsers repeat
 * thead/tfoot on every page, so each sheet's content starts below the
 * header and ends above the footer. On screen the header/footer render
 * once at the top/bottom of the sheet.
 *
 * At print the component injects `@page { margin: 0 }` (which leaves
 * Chrome no margin box to draw its date/URL/page-count header in) and
 * moves the visual margin onto the sheet's own padding. It also marks
 * the document as owning its print CSS (a
 * `meta[name="omelette-owns-print"]` it injects at runtime), so the
 * PDF export never injects page-geometry CSS of its own on top.
 *
 * Print best practices for the content you author:
 * - Multi-column text: use CSS columns (`column-count` +
 *   `column-gap`), never side-by-side flex/grid columns — only real
 *   CSS columns flow and break across pages. `column-span: all` lets
 *   a heading span the columns; `hyphens: auto` (needs `lang` on
 *   the html element) keeps narrow columns readable.
 * - Page breaks in flowing documents: `break-before: page` on an
 *   element that must start a new page (a chapter, an appendix). Add
 *   your own kept-together blocks (callouts, stat tiles, cards) to a
 *   `break-inside: avoid` rule, and keep each one shorter than a page.
 * - Extend `orphans: 3; widows: 3` to any custom text blocks you add
 *   (p and li are covered by default).
 * - Give long tables a <thead> — browsers repeat it on every printed
 *   page.
 * - No `position: fixed`/`sticky` and no viewport units in content:
 *   fixed elements stamp every printed page (running headers/footers go
 *   in the component's slots) and `100vh` mis-sizes at print.
 *
 * Author content as static HTML so the user can click-to-edit any text
 * directly. Do not set width/padding/background on the document body —
 * the component owns the sheet box.
 */
/* END USAGE */

(() => {
  const PAPER = {
    letter: ['8.5in', '11in'],
    a4: ['210mm', '297mm'],
    legal: ['8.5in', '14in']
  };
  const CSS_LENGTH = /^\d+(\.\d+)?(px|in|mm|cm|pt|pc)$/;
  // Unitless "0" is a valid CSS length and the natural way to write
  // margin="0"; normalise it to 0px so max()/calc() (which reject a bare
  // number) keep working.
  const safeLen = (v, fb) => {
    v = (v || '').trim();
    return v === '0' ? '0px' : CSS_LENGTH.test(v) ? v : fb;
  };
  // WebKit (Safari and every iOS browser shell) never repeats a table's
  // thead/tfoot on printed pages (WebKit bug 17205), so the spacer-borne
  // vertical margins of a FLOWING document reach only the first page
  // there. Engine check, not browser check: vendor is 'Apple Computer,
  // Inc.' exactly for WebKit and 'Google Inc.' for Blink.
  const WK_PRINT = /apple/i.test(navigator.vendor || '');
  // CSS length → px number (CSS absolute units are exact: 1in = 96px).
  // Returns NaN for anything safeLen would reject — callers gate on it.
  const PX_PER = {
    px: 1,
    in: 96,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    pt: 96 / 72,
    pc: 16
  };
  const toPx = v => {
    const m = /^(\d+(?:\.\d+)?)(px|in|mm|cm|pt|pc)$/.exec((v || '').trim());
    return m ? parseFloat(m[1]) * PX_PER[m[2]] : NaN;
  };
  const stylesheet = `
    :host {
      position: relative;
      display: block;
      /* When the viewport is narrower than the page, grow to wrap the
       * sheet (plus this padding) instead of staying viewport-width, so
       * the desk background and right margin reach the sheet's far edge
       * in the horizontal scroll. */
      min-width: max-content;
      min-height: 100vh;
      background: #f5f5f4;
      padding: 48px 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      --doc-page-w: 8.5in;
      --doc-page-h: 11in;
      --doc-page-margin: 0.75in;
      --doc-hdr-h: 0px;
      --doc-ftr-h: 0px;
      --doc-hdr-pad: 0px;
      --doc-ftr-pad: 0px;
    }
    .sheet {
      width: var(--doc-page-w);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 10px rgba(20, 20, 19, 0.12);
      border-radius: 7px;
      box-sizing: border-box;
      padding: var(--doc-page-margin);
    }
    .frame { width: 100%; border-collapse: collapse; }
    /* Scaled-fit mode (content-width/content-height): the inner .fit box
     * lays the content out at its authored fixed size and scales it onto
     * the printable area; .fit-box reserves the scaled footprint in flow
     * (transforms don't affect layout) and centers it. Without the mode,
     * both divs are unstyled block pass-throughs. */
    /* Explicit pagination: direct .page children are the pages. The sheet
     * becomes a transparent stack and each page carries the card look on
     * screen; at print each page is exactly one full-bleed sheet. The
     * ::slotted defaults are deliberately weak (document CSS wins), so
     * authored page styling can override any of this. */
    .sheet.paginated {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }
    .paginated ::slotted(.page) {
      position: relative;
      display: block;
      width: 100%;
      aspect-ratio: var(--doc-page-ar);
      container-type: size;
      overflow: hidden;
      box-sizing: border-box;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
      break-inside: avoid;
    }
    .paginated ::slotted(.page:not(:first-child)) { margin-top: 1rem; }
    @media print {
      .sheet.paginated { padding: 0; }
      /* The flowing-document vertical inset lives on the repeating
       * thead/tfoot spacers, not the sheet padding — they must go too,
       * or each full-sheet .page is pushed ~margin down and spills onto
       * a second sheet. Paginated pages are full-bleed by definition
       * (content owns its insets). */
      .sheet.paginated .hdr-space,
      .sheet.paginated .ftr-space { height: 0; }
      .paginated ::slotted(.page) {
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        /* Physical page-box sizing, no viewport units: Safari resolves
         * 100vh against the window, not the page box, so a vh-sized card
         * paginates wrong there. --doc-page-w/h are the named size by
         * default and are overridden to the user's chosen paper by the
         * export path, so every card is exactly one sheet either way.
         * Width + height (same source values as @page size) rather than
         * width + aspect-ratio: the ratio is a 6-decimal rounding of the
         * same division, and a few millionths of overflow would spill a
         * blank sheet after every page. The screen-only aspect-ratio
         * (preview proportions) must not leak into print. cqh typography
         * tracks the same box.
         *
         * Every declaration is !important: per CSS Scoping, unimportant
         * shadow ::slotted rules LOSE to the document context, so a page
         * section's authored inline style would silently beat this print
         * geometry. A model-authored height:100% did exactly that — the
         * percentage resolves as auto in the all-auto print ancestry, the
         * base rule's size containment turns auto into ZERO, and
         * overflow:hidden then paints nothing: a blank PDF with perfect
         * page boxes. At print the component's geometry is the design's
         * whole contract, so it must win over any authored sizing. */
        aspect-ratio: auto !important;
        width: var(--doc-page-w) !important;
        height: var(--doc-page-h) !important;
        overflow: hidden !important;
      }
      .paginated ::slotted(.page:not(:first-child)) {
        break-before: page !important;
        margin-top: 0 !important;
      }
    }
    .fit-mode .fit-box {
      width: calc(var(--doc-fit-w) * var(--doc-fit-scale));
      height: calc(var(--doc-fit-h) * var(--doc-fit-scale));
      margin: 0 auto;
      break-inside: avoid;
    }
    /* Monolithic at print: Blink slices a transform-scaled child at
     * fragmentainer boundaries mapped in UNSCALED layout coordinates
     * (transforms are paint-time), so the .fit box (authored size, e.g.
     * 1400x990) gets cut at the page's free block space and spills onto
     * a second sheet even though its SCALED footprint fits the page by
     * construction. overflow:hidden makes .fit-box a scroll container —
     * monolithic under fragmentation (css-break-3) — so the scaled
     * content prints atomically on one sheet. No clipping for content
     * within the authored box: .fit-box is calc-sized to exactly the
     * scaled footprint. (Content that bleeds past content-width/height
     * is clipped at the footprint — fit mode's contract; it previously
     * painted beyond it at print.) Print-only, so the screen rendering
     * keeps visible overflow for editor affordances.
     * The export path injects the same rule into frozen copies
     * (print-eval.ts om-print-fit-contain). The .fit-mode scope is
     * load-bearing: .fit-box wraps slotted content in EVERY mode, and an
     * unscoped overflow:hidden would make whole flowing documents
     * monolithic (one truncated sheet). overflow:hidden, never clip —
     * clip is not a scroll container, so not monolithic. */
    @media print {
      .fit-mode .fit-box { overflow: hidden; }
    }
    .fit-mode .fit {
      width: var(--doc-fit-w);
      height: var(--doc-fit-h);
      transform: scale(var(--doc-fit-scale));
      transform-origin: top left;
    }
    .frame td, .frame th { padding: 0; text-align: left; font-weight: inherit; }
    .hdr-space { height: var(--doc-hdr-h); }
    .ftr-space { height: var(--doc-ftr-h); }
    ::slotted([slot="header"]),
    ::slotted([slot="footer"]) { display: block; box-sizing: border-box; }
    @media print {
      :host { background: none; padding: 0; min-width: 0; min-height: 0; }
      .sheet {
        width: auto; margin: 0; box-shadow: none; border-radius: 0;
        padding: 0 var(--doc-page-margin);
      }
      /* The thead/tfoot spacers repeat on every page, so they carry the
       * vertical page margin (which the sheet's own padding cannot, since
       * that padding is consumed once on the first/last page). The running
       * header/footer are fixed inside that band. */
      /* The 0.35in is breathing room between a running header/footer and
       * the body; without one the spacer is exactly the page margin, so a
       * margin="0" full-bleed document gets truly full-bleed pages. */
      .hdr-space { height: max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))); }
      .ftr-space { height: max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))); }
      /* WebKit flowing documents: @page carries the vertical margin (see
       * _syncPrintPageRule), so the spacers keep only whatever a running
       * header/footer needs BEYOND it — page 1 would otherwise double its
       * top inset. Paginated sheets already zero their spacers above. */
      .sheet.wk-print:not(.paginated) .hdr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))) - var(--doc-page-margin))); }
      .sheet.wk-print:not(.paginated) .ftr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))) - var(--doc-page-margin))); }
      ::slotted([slot="header"]) {
        position: fixed; top: 0; left: 0; right: 0; margin: 0;
        padding: calc(var(--doc-page-margin) * 0.45) var(--doc-page-margin) 0;
      }
      ::slotted([slot="footer"]) {
        position: fixed; bottom: 0; left: 0; right: 0; margin: 0;
        padding: 0 var(--doc-page-margin) calc(var(--doc-page-margin) * 0.45);
      }
    }
  `;
  class DocPage extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'width', 'height', 'margin', 'orientation', 'content-width', 'content-height'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._mo = typeof MutationObserver === 'function' ? new MutationObserver(() => this._scheduleMeasure()) : null;
    }

    /** The named paper's [w, h], swapped when orientation="landscape".
     *  Only the named size swaps — explicit width/height are exact values
     *  the author already oriented. */
    _paperSize() {
      const named = PAPER[(this.getAttribute('size') || '').toLowerCase()] || PAPER.letter;
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? [named[1], named[0]] : named;
    }
    get pageWidth() {
      return safeLen(this.getAttribute('width'), this._paperSize()[0]);
    }
    get pageHeight() {
      return safeLen(this.getAttribute('height'), this._paperSize()[1]);
    }
    get pageMargin() {
      return safeLen(this.getAttribute('margin'), '0.75in');
    }

    /** Scaled-fit mode's content box [w, h] as CSS lengths, or null when
     *  the mode is off (either attribute missing/invalid/zero — a partial
     *  declaration falls back to normal flow rather than guessing). */
    _contentFit() {
      const w = safeLen(this.getAttribute('content-width'), null);
      const h = safeLen(this.getAttribute('content-height'), null);
      if (!w || !h) return null;
      const wPx = toPx(w),
        hPx = toPx(h);
      return wPx > 0 && hPx > 0 ? [w, h, wPx, hPx] : null;
    }
    connectedCallback() {
      if (!this._sheet) this._render();
      this._syncSize();
      this._syncPrintPageRule();
      this._ensureTextWrapDefaults();
      this._ensureOwnsPrintMeta();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      if (this._mo) this._mo.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      this._onResize = () => this._scheduleMeasure();
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this._scheduleMeasure());
      }
      this._scheduleMeasure();
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      if (this._mo) this._mo.disconnect();
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      // Drop the head rules when the last doc-page leaves, so a deleted
      // document's @page geometry and text-wrap defaults can't apply to
      // whatever replaces it.
      const survivor = document.querySelector('doc-page');
      if (!survivor) {
        ['doc-page-print', 'doc-page-text-wrap', 'doc-page-owns-print', 'doc-page-fixed-size', 'doc-page-print-sizing'].forEach(id => {
          const tag = document.getElementById(id);
          if (tag) tag.remove();
        });
        // A live deck-stage deferred its own print-sizing meta to ours —
        // hand the page-global meta over so the deck isn't left unmarked.
        const deck = document.querySelector('deck-stage');
        if (deck && typeof deck._ensurePrintSizingMeta === 'function') {
          deck._ensurePrintSizingMeta();
        }
      } else {
        // A departed owner hands each page-global meta to whatever
        // doc-page remains (or it's removed).
        if (typeof survivor._syncFixedSizeMeta === 'function') {
          survivor._syncFixedSizeMeta();
        }
        if (typeof survivor._syncPrintSizingMeta === 'function') {
          survivor._syncPrintSizingMeta();
        }
      }
    }
    attributeChangedCallback() {
      if (!this._sheet) return;
      this._syncSize();
      this._syncPrintPageRule();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      this._scheduleMeasure();
    }
    _render() {
      this._root.innerHTML = `
        <style>${stylesheet}</style>
        <style id="vars"></style>
        <div class="sheet" data-screen-label="Document">
          <table class="frame" role="presentation">
            <thead><tr><th><div class="hdr-space"><slot name="header"></slot></div></th></tr></thead>
            <tbody><tr><td class="body"><div class="fit-box"><div class="fit"><slot></slot></div></div></td></tr></tbody>
            <tfoot><tr><td><div class="ftr-space"><slot name="footer"></slot></div></td></tr></tfoot>
          </table>
        </div>`;
      this._sheet = this._root.querySelector('.sheet');
      this._vars = this._root.getElementById('vars');
    }

    /** Runtime sizing lives in a shadow <style> :host rule, never on the
     *  light-DOM host element, so serialize-persist can't write it back. */
    _syncSize(hdrH, ftrH) {
      // Scaled-fit mode: content at its authored size, scaled onto the
      // printable area (page minus margins on both axes). The factor is a
      // plain number var so calc(length * number) stays valid; 4 decimals
      // keeps the shadow style stable across re-measures. Upscaling is
      // allowed — print transforms are vector, so text and CSS stay crisp
      // (raster images soften, which the catalog bullet warns about).
      const fit = this._contentFit();
      let fitVars = '';
      if (fit) {
        const marginPx = toPx(this.pageMargin) || 0;
        const availW = toPx(this.pageWidth) - 2 * marginPx;
        const availH = toPx(this.pageHeight) - 2 * marginPx;
        const scale = Math.min(availW / fit[2], availH / fit[3]);
        if (scale > 0 && Number.isFinite(scale)) {
          fitVars = '--doc-fit-w:' + fit[0] + ';' + '--doc-fit-h:' + fit[1] + ';' + '--doc-fit-scale:' + scale.toFixed(4) + ';';
        }
      }
      this._sheet.classList.toggle('fit-mode', !!fitVars);
      // Numeric w/h ratio for the paginated page cards' aspect-ratio —
      // aspect-ratio takes a number, not a length ratio, so compute it
      // here (CSS length division isn't portable). 6 decimals keeps the
      // shadow style stable across re-syncs.
      const arW = toPx(this.pageWidth);
      const arH = toPx(this.pageHeight);
      const ar = arW > 0 && arH > 0 ? (arW / arH).toFixed(6) : '0.772727';
      this._vars.textContent = ':host{' + fitVars + '--doc-page-ar:' + ar + ';' + '--doc-page-w:' + this.pageWidth + ';' + '--doc-page-h:' + this.pageHeight + ';' + '--doc-page-margin:' + this.pageMargin + ';' + '--doc-hdr-h:' + (hdrH || 0) + 'px;' + '--doc-ftr-h:' + (ftrH || 0) + 'px;' + '--doc-hdr-pad:' + (hdrH ? '0.35in' : '0px') + ';' + '--doc-ftr-pad:' + (ftrH ? '0.35in' : '0px') + '}';
    }

    /** @page is a no-op inside shadow DOM, so the rule lives in <head>.
     *  Re-appended on every sync so it stays last in source order — the
     *  @page cascade is source-order per descriptor, so this rule wins
     *  over any other @page rule in the document.
     *
     *  The @page SIZE is pinned where the page box IS part of the design:
     *  explicit-fixed-size mode (width + height authored), scaled-fit
     *  mode (the named sheet the fit targets), and explicit pagination
     *  (the named size the cards share — so card and sheet agree on
     *  every print path, and the export path's chosen paper overrides
     *  BOTH with one later rule). For FLOWING documents no paper size is
     *  emitted at all — the true size comes from the user's preference,
     *  injected by the export path or chosen in the print dialog — so a
     *  flowing document never fights the paper it lands on.
     *  margin: 0 is emitted in every mode: it leaves Chrome no margin box
     *  to draw its date/URL/page-count header in, and the visual margin
     *  lives on the sheet's own padding. */
    _syncPrintPageRule() {
      const id = 'doc-page-print';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      document.head.appendChild(tag);
      // Three print-geometry regimes:
      // - true-size: the page IS the design — pin its exact size.
      // - scaled-fit (content-width/height): the fit factor is computed
      //   against the NAMED paper's printable area, so that paper must
      //   stay pinned or the scaled content overflows a smaller sheet
      //   (the export path re-fits and re-pins at print time on top).
      // - default modes: no paper size — but landscape still needs the
      //   paper-agnostic 'size: landscape' keyword, because the size
      //   descriptor is what carries orientation; without it a landscape
      //   document prints portrait whenever nothing injects a size.
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      // Explicit pagination pins the page box to the SAME values that
      // size the cards (the named size by default, the export path's
      // chosen paper when its later rule overrides both) — card and
      // sheet agree on every print path, and a mismatched real paper
      // shrinks-to-fit in the dialog instead of clipping a Letter card
      // on A4. Declared before the paginated read below so both derive
      // from one check.
      const paginatedNow = this.querySelector(':scope > .page') !== null;
      const sizeDescriptor = this._trueSizePx() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : this._contentFit() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : paginatedNow ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : landscape ? 'size: landscape; ' : '';
      // WebKit never repeats the thead/tfoot spacers that carry a flowing
      // document's vertical page margins (see WK_PRINT above), so pages
      // after the first print edge-to-edge there. Carry the VERTICAL
      // margins on @page for WebKit instead, and the shadow print CSS
      // trims the first-page spacers by the same amount (.sheet.wk-print
      // rules). Horizontal inset stays on the sheet's own padding in
      // every engine. Blink keeps margin: 0 (a nonzero margin there
      // re-opens the box Chrome draws its header furniture in). One cost,
      // learned in testing: Safari's own date/URL headers are a USER
      // dialog setting ("Print headers and footers") that renders in the
      // margin area when room exists — margin: 0 only suppressed it by
      // leaving no room, and no CSS controls it. The export dialog's
      // Safari guide teaches turning the setting off for flowing
      // documents. Explicitly paginated and fixed-size documents keep
      // margin: 0 everywhere: their pages ARE the sheet.
      const wkFlowing = WK_PRINT && !paginatedNow && !this._trueSizePx() && !this._contentFit();
      const marginDescriptor = wkFlowing ? 'margin: ' + this.pageMargin + ' 0; ' : 'margin: 0; ';
      // Shadow-internal marker (never serialized), kept in lockstep with
      // the @page decision above: the print CSS trims the first-page
      // spacers ONLY while @page actually carries the margins — a
      // true-size or scaled-fit sheet keeps margin: 0 and must keep its
      // spacers too. Re-synced here so attribute changes and pagination
      // flips move both together.
      if (this._sheet) this._sheet.classList.toggle('wk-print', wkFlowing);
      tag.textContent = '@page { ' + sizeDescriptor + marginDescriptor + '} ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; height: auto !important; overflow: visible !important; } ' + 'h1,h2,h3,h4,h5,h6 { break-after: avoid; } ' + 'figure,pre,blockquote,img,svg,tr { break-inside: avoid; } ' + 'p,li { orphans: 3; widows: 3; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; ' + 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important; } ' + '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }

    /** Typographic defaults for document text: balance headings, avoid
     *  widowed/orphaned words in body copy (browsers without text-wrap
     *  support drop the declarations). Zero-specificity via :where() so
     *  any text-wrap authored on those elements wins; document-level so the
     *  rules reach the slotted (light DOM) content — shadow styles can't.
     *  data-omelette-injected marks the tag for the host editor to strip
     *  at serialize, so it is never written back as authored source. */
    _ensureTextWrapDefaults() {
      if (document.getElementById('doc-page-text-wrap')) return;
      const tag = document.createElement('style');
      tag.id = 'doc-page-text-wrap';
      tag.setAttribute('data-omelette-injected', '');
      tag.textContent = ':where(h1,h2,h3,h4,h5,h6){text-wrap:balance}' + ':where(p,li,blockquote,figcaption){text-wrap:pretty}';
      document.head.appendChild(tag);
    }

    /** Declares that this document owns its print CSS. The instant-PDF
     *  export checks for the meta by NAME PRESENCE alone (content is
     *  ignored) and skips its automatic print-CSS injections, so the
     *  component's @page geometry is never overridden by a heuristic.
     *  data-omelette-injected keeps it out of serialized source. */
    _ensureOwnsPrintMeta() {
      if (document.getElementById('doc-page-owns-print')) return;
      const tag = document.createElement('meta');
      tag.id = 'doc-page-owns-print';
      tag.name = 'omelette-owns-print';
      tag.content = 'true';
      tag.setAttribute('data-omelette-injected', '');
      document.head.appendChild(tag);
    }

    /** This page's valid true-size page box (explicit width AND height)
     *  as [w, h] px ints, or null when the mode is off. */
    _trueSizePx() {
      if (!safeLen(this.getAttribute('width'), null) || !safeLen(this.getAttribute('height'), null)) return null;
      const w = Math.round(toPx(this.pageWidth));
      const h = Math.round(toPx(this.pageHeight));
      return w > 0 && h > 0 ? [w, h] : null;
    }

    /** True-size pages (explicit width AND height) also declare the page
     *  box as the preview size: the in-app preview reads
     *  meta[name="omelette-fixed-size"] (content "W,H" in px ints) and
     *  scales the sheet into view — without it an 18in poster previews at
     *  true size with scrollbars. Never overrides an author-set meta
     *  (only the component's own id is managed). The meta is page-global
     *  while doc-page instances are not, so every sync recomputes the
     *  page-wide owner — the first connected true-size doc-page — and a
     *  non-true-size sibling's sync can never delete the owner's meta.
     *  Removed when no true-size page remains (the owner's disconnect
     *  re-syncs via any survivor) or when an author-set meta exists. */
    _syncFixedSizeMeta() {
      const id = 'doc-page-fixed-size';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-fixed-size"]:not([data-omelette-injected])');
      // The page-wide owner, not this instance: an upgraded true-size page
      // anywhere in the document keeps the meta alive and sized.
      let box = null;
      for (const el of document.querySelectorAll('doc-page')) {
        box = typeof el._trueSizePx === 'function' ? el._trueSizePx() : null;
        if (box) break;
      }
      if (!box || authored) {
        if (own) own.remove();
        return;
      }
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-fixed-size';
      tag.content = box[0] + ',' + box[1];
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }

    /** This page's print-sizing mode: 'fixed' when an explicit width AND
     *  height are authored (the page is the design's own size), else the
     *  default paper in the authored orientation. */
    _printSizingMode() {
      if (this._trueSizePx()) return 'fixed';
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? 'default-landscape' : 'default-portrait';
    }

    /** Announces the print-sizing mode to the host app:
     *  meta[name="omelette-print-sizing"] with content 'default-portrait',
     *  'default-landscape', or 'fixed' (fixed pages also carry the
     *  omelette-fixed-size meta with the page box in px). The export path
     *  probes it to decide what true paper size to inject at print time —
     *  in the default modes the component emits no paper size of its own.
     *  Same page-global ownership rules as the fixed-size meta above:
     *  first connected doc-page owns it, an authored meta is never
     *  overridden, removed when no doc-page remains. */
    _syncPrintSizingMeta() {
      const id = 'doc-page-print-sizing';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-print-sizing"]:not([data-omelette-injected])');
      // A fixed page wins outright (mirroring the fixed-size loop above,
      // so the two metas can never contradict each other in a mixed
      // multi-page document); otherwise the first page's mode holds.
      let mode = null;
      for (const el of document.querySelectorAll('doc-page')) {
        if (typeof el._printSizingMode !== 'function') continue;
        const m = el._printSizingMode();
        if (m === 'fixed') {
          mode = m;
          break;
        }
        if (mode === null) mode = m;
      }
      if (!mode || authored) {
        if (own) own.remove();
        return;
      }
      // A deck-stage that connected first injected its own meta and
      // defers to any existing one — take it over, or the document ends
      // up with two conflicting injected metas (a doc-page page is the
      // document; the deck re-ensures its meta if every doc-page leaves).
      const deckMeta = document.getElementById('deck-stage-print-sizing');
      if (deckMeta) deckMeta.remove();
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-print-sizing';
      tag.content = mode;
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }
    _scheduleMeasure() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._measure();
      });
    }

    /** Slot heights feed the print spacers (--doc-hdr-h / --doc-ftr-h), so
     *  they re-measure on content mutation, resize, and font load. The
     *  same pass detects explicit pagination (direct .page children) and
     *  toggles the sheet between the flowing-document card and the
     *  page-per-card stack — content edits can add or remove pages at any
     *  time, so this tracks the same mutations the measurement does. */
    _measure() {
      const hdr = this.querySelector(':scope > [slot="header"]');
      const ftr = this.querySelector(':scope > [slot="footer"]');
      const wasPaginated = this._sheet.classList.contains('paginated');
      this._sheet.classList.toggle('paginated', this.querySelector(':scope > .page') !== null);
      // The WebKit @page margin is flowing-only, so a pagination flip
      // must re-emit the rule (content edits can add or remove .page
      // sections at any time).
      if (this._sheet.classList.contains('paginated') !== wasPaginated) {
        this._syncPrintPageRule();
      }
      this._syncSize(hdr ? hdr.offsetHeight : 0, ftr ? ftr.offsetHeight : 0);
    }
  }
  if (!customElements.get('doc-page')) {
    customElements.define('doc-page', DocPage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "impressions/doc-page.js", error: String((e && e.message) || e) }); }

// outils/editeur/App.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LS = 'by-editeur-cuvees',
  LSP = 'by-editeur-pictos';
const ICON2PICTO = {
  Hop: 'houblon',
  Snowflake: 'flocon',
  Leaf: 'feuille',
  Zap: 'eclair',
  Citrus: 'agrume',
  SunMoon: 'mode-sombre',
  Moon: 'lune',
  Cherry: 'cerise',
  Orbit: 'orbite',
  Wheat: 'epi'
};
const HEX = Object.fromEntries(PALETTE.map(([n, h]) => ['var(--cuvee-' + n + ')', h]));
const seed = () => (window.CUVEES || []).map(c => ({
  ...c,
  accent: HEX[c.accent] || '#D9480F',
  picto: ICON2PICTO[c.icon] || 'houblon'
}));
const LP = {
  ingredientSpacing: 1.3,
  ebcDisplay: 'segments',
  ruleWidth: 64,
  ruleWeight: 0.8
};
const ASSETS = window.BY_ASSETS || {
  logoSrc: '../../assets/logo-brasse-yutz.svg',
  pregnancySrc: '../../assets/legal/zero-alcool-grossesse-gris.svg',
  trimanSrc: '../../assets/legal/triman-gris.png'
};
const slug = s => String(s || 'etiquette').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pictoUrl = (svg, color) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/currentColor/g, color));
function download(name, url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
let fontCSS = null;
async function getFontCSS() {
  if (fontCSS !== null) return fontCSS;
  try {
    const css = await (await fetch('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap')).text();
    const urls = [...new Set(css.match(/https:[^)]+\.woff2/g) || [])];
    let out = css;
    for (const u of urls) {
      const b = await (await fetch(u)).blob();
      const d = await new Promise(r => {
        const fr = new FileReader();
        fr.onload = () => r(fr.result);
        fr.readAsDataURL(b);
      });
      out = out.split(u).join(d);
    }
    fontCSS = out;
  } catch (e) {
    fontCSS = '';
  }
  return fontCSS;
}
function Btn({
  children,
  onClick,
  primary,
  small
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      padding: small ? '6px 10px' : '10px 14px',
      border: '1px solid var(--encre)',
      background: primary ? h ? 'var(--encre-2)' : 'var(--encre)' : h ? 'var(--papier-2)' : '#fff',
      color: primary ? '#fff' : 'var(--encre)',
      font: '600 11px var(--font-text)',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      textAlign: 'left',
      whiteSpace: 'nowrap'
    }
  }, children);
}
function PrintSheet({
  c,
  bottle,
  art
}) {
  const {
    BeerLabel
  } = window.DS;
  const k = {
    position: 'absolute',
    background: '#161616'
  };
  const L = 7,
    G = 1.5;
  const marks = [...[0, 140, 280].flatMap(x => [{
    ...k,
    left: x + 'mm',
    top: -(L + G) + 'mm',
    width: '0.35mm',
    height: L + 'mm',
    marginLeft: '-0.175mm'
  }, {
    ...k,
    left: x + 'mm',
    bottom: -(L + G) + 'mm',
    width: '0.35mm',
    height: L + 'mm',
    marginLeft: '-0.175mm'
  }]), ...[0, 75, 150].flatMap(y => [{
    ...k,
    top: y + 'mm',
    left: -(L + G) + 'mm',
    height: '0.35mm',
    width: L + 'mm',
    marginTop: '-0.175mm'
  }, {
    ...k,
    top: y + 'mm',
    right: -(L + G) + 'mm',
    height: '0.35mm',
    width: L + 'mm',
    marginTop: '-0.175mm'
  }])];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '297mm',
      height: '210mm',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '140mm 140mm',
      gridTemplateRows: '75mm 75mm',
      position: 'relative'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement(BeerLabel, _extends({
    key: i
  }, c, LP, ASSETS, {
    artwork: art,
    bottle: bottle
  }))), marks.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: s
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '12mm',
      textAlign: 'center',
      font: '500 2.4mm var(--font-mono)',
      color: '#86857F'
    }
  }, c.name, " \xB7 ", bottle === '33cl' ? '33 cl' : '75 cl', " \xB7 lot ", c.lot, " \xB7 imprimer \xE0 100 % \xB7 rogner les marges puis 2 coupes sur les rep\xE8res"));
}
function App() {
  const {
    BeerLabel
  } = window.DS;
  const [list, setList] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS)) || seed();
    } catch (e) {
      return seed();
    }
  });
  const [userPictos, setUserPictos] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LSP)) || {};
    } catch (e) {
      return {};
    }
  });
  const [idx, setIdx] = React.useState(0);
  const [bottle, setBottle] = React.useState('75cl');
  const [busy, setBusy] = React.useState('');
  React.useEffect(() => localStorage.setItem(LS, JSON.stringify(list)), [list]);
  React.useEffect(() => localStorage.setItem(LSP, JSON.stringify(userPictos)), [userPictos]);
  const pictos = {
    ...window.PICTOS,
    ...Object.fromEntries(Object.entries(userPictos).map(([k, s]) => [k, {
      groupe: 'Mes pictos',
      svg: s
    }]))
  };
  const c = list[Math.min(idx, list.length - 1)] || seed()[0];
  const set = p => setList(l => l.map((x, i) => i === idx ? {
    ...x,
    ...p
  } : x));
  const art = pictos[c.picto] ? pictoUrl(pictos[c.picto].svg, c.accent) : undefined;
  const exportRef = React.useRef(null);
  const exportPng = async b => {
    setBusy('PNG ' + b);
    const node = exportRef.current.querySelector('[data-b="' + b + '"] > div');
    const fc = await getFontCSS();
    const opts = {
      pixelRatio: 1654 / node.offsetWidth,
      backgroundColor: '#ffffff',
      cacheBust: true
    };
    if (fc) opts.fontEmbedCSS = fc;
    try {
      const url = await htmlToImage.toPng(node, opts);
      download(slug(c.name) + '-' + b + '.png', url);
    } catch (e) {
      alert('Export PNG impossible : ' + e.message);
    }
    setBusy('');
  };
  const print = b => {
    ReactDOM.createRoot(document.getElementById('print-root')).render(/*#__PURE__*/React.createElement(PrintSheet, {
      c: c,
      bottle: b,
      art: art
    }));
    setTimeout(() => window.print(), 600);
  };
  const neu = () => {
    const b = Math.max(0, ...list.map(x => Number(x.brew) || 0)) + 1;
    setList(l => [...l, {
      ...c,
      id: 'cuvee-' + Date.now(),
      name: 'Nouvelle cuvée',
      edition: '',
      brew: b
    }]);
    setIdx(list.length);
  };
  const dup = () => {
    setList(l => [...l, {
      ...c,
      id: 'cuvee-' + Date.now(),
      name: c.name + ' (copie)'
    }]);
    setIdx(list.length);
  };
  const del = () => {
    if (list.length < 2 || !confirm('Supprimer « ' + c.name + ' » ?')) return;
    setList(l => l.filter((_, i) => i !== idx));
    setIdx(0);
  };
  const exportJson = () => download('cuvees-brasse-yutz.json', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
    cuvees: list,
    pictos: userPictos
  }, null, 2)));
  const importJson = e => {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then(t => {
      const d = JSON.parse(t);
      if (d.cuvees) {
        setList(d.cuvees);
        setIdx(0);
      }
      if (d.pictos) setUserPictos(d.pictos);
    });
    e.target.value = '';
  };
  const cap = {
    font: '600 10px var(--font-mono)',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 250,
      flex: 'none',
      background: '#fff',
      borderRight: '1px solid var(--filet)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 18px 14px',
      borderBottom: '1px solid var(--filet)',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: ASSETS.logoSrc,
    style: {
      height: 34
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      color: 'var(--encre)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      width: 55,
      font: '600 9px/1 var(--font-text)',
      textTransform: 'uppercase'
    }
  }, [...'Brasse'].map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, l))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 55,
      height: 2,
      background: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      width: 55,
      font: '600 14px/1 var(--font-text)',
      textTransform: 'uppercase'
    }
  }, [...'Yutz'].map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: cap
  }, "\xC9diteur d'\xE9tiquettes")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, list.map((x, i) => /*#__PURE__*/React.createElement("button", {
    key: x.id || i,
    onClick: () => setIdx(i),
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      width: '100%',
      padding: '10px 18px',
      border: 'none',
      borderBottom: '1px solid var(--papier-2)',
      background: i === idx ? 'var(--papier-2)' : '#fff',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      flex: 'none',
      border: '1px solid var(--filet)',
      display: 'grid',
      placeItems: 'center',
      color: x.accent
    },
    dangerouslySetInnerHTML: {
      __html: (pictos[x.picto] || pictos.houblon).svg.replace('width="24" height="24"', 'width="18" height="18"')
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: '400 19px/1.05 var(--font-display)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, x.name, x.edition ? ' ' + x.edition : ''), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 11px var(--font-mono)',
      color: 'var(--text-muted)'
    }
  }, "N\xB0 ", x.brew, " \xB7 ", x.styleName))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 6,
      borderTop: '1px solid var(--filet)'
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    small: true,
    onClick: neu
  }, "+ Nouvelle"), /*#__PURE__*/React.createElement(Btn, {
    small: true,
    onClick: dup
  }, "Dupliquer"), /*#__PURE__*/React.createElement(Btn, {
    small: true,
    onClick: exportJson
  }, "Sauver .json"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'contents'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '6px 10px',
      border: '1px solid var(--encre)',
      font: '600 11px var(--font-text)',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      textAlign: 'left',
      background: '#fff'
    }
  }, "Ouvrir .json", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".json",
    onChange: importJson,
    style: {
      display: 'none'
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    small: true,
    onClick: del
  }, "Supprimer")))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 420,
      flex: 'none',
      overflow: 'auto',
      padding: '22px 22px 40px',
      borderRight: '1px solid var(--filet)',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement(Form, {
    c: c,
    set: set,
    pictos: pictos,
    onAddPicto: (k, s) => {
      setUserPictos(p => ({
        ...p,
        [slug(k)]: s
      }));
      set({
        picto: slug(k)
      });
    }
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px',
      borderBottom: '1px solid var(--filet)',
      background: '#fff',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      border: '1px solid var(--encre)'
    }
  }, ['75cl', '33cl'].map(b => /*#__PURE__*/React.createElement("button", {
    key: b,
    onClick: () => setBottle(b),
    style: {
      padding: '8px 14px',
      border: 'none',
      background: bottle === b ? 'var(--encre)' : '#fff',
      color: bottle === b ? '#fff' : 'var(--encre)',
      font: '600 11px var(--font-text)',
      letterSpacing: '.12em',
      cursor: 'pointer'
    }
  }, b.replace('cl', ' CL')))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => exportPng('75cl')
  }, "PNG 75 cl"), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => exportPng('33cl')
  }, "PNG 33 cl"), /*#__PURE__*/React.createElement(Btn, {
    primary: true,
    onClick: () => print(bottle)
  }, "Imprimer planche A4")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      display: 'flex',
      padding: 32,
      background: 'var(--papier-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'auto',
      boxShadow: 'var(--shadow-print)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(BeerLabel, _extends({}, c, LP, ASSETS, {
    artwork: art,
    bottle: bottle,
    scale: 1.35
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 22px',
      background: '#fff',
      borderTop: '1px solid var(--filet)',
      font: '500 11px var(--font-mono)',
      color: 'var(--text-muted)',
      display: 'flex',
      gap: 18,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, busy ? 'Export ' + busy + '…' : 'Sauvegarde automatique dans ce navigateur'), /*#__PURE__*/React.createElement("span", null, "PNG = 1654 px de large (300 dpi, 140 \xD7 75 mm)"), /*#__PURE__*/React.createElement("span", null, "Planche : A4 paysage, 4 \xE9tiquettes, imprimer \xE0 100 %"))), /*#__PURE__*/React.createElement("div", {
    ref: exportRef,
    style: {
      position: 'fixed',
      left: -10000,
      top: 0
    }
  }, ['75cl', '33cl'].map(b => /*#__PURE__*/React.createElement("div", {
    key: b,
    "data-b": b
  }, /*#__PURE__*/React.createElement(BeerLabel, _extends({}, c, LP, ASSETS, {
    artwork: art,
    bottle: b
  }))))));
}
window.__dsReady.then(() => ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null)));
})(); } catch (e) { __ds_ns.__errors.push({ path: "outils/editeur/App.jsx", error: String((e && e.message) || e) }); }

// outils/editeur/Form.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PALETTE = [['orange', '#D9480F'], ['houblon', '#4F8A2B'], ['ocre', '#A87B00'], ['framboise', '#C2255C'], ['bleu', '#1F63B0'], ['violet', '#6A4BC4'], ['bordeaux', '#8A1F2E'], ['malt', '#5E3A22']];
function Field({
  label,
  hint,
  children,
  span
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      gridColumn: span ? '1 / -1' : 'auto',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 10px var(--font-mono)',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), children, hint && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 11px/1.35 var(--font-text)',
      color: 'var(--text-muted)'
    }
  }, hint));
}
function Section({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      paddingBottom: 18,
      borderBottom: '1px solid var(--filet)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 22px/1 var(--font-display)',
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, children));
}
function PictoPicker({
  value,
  onChange,
  pictos,
  color
}) {
  const groups = {};
  Object.entries(pictos).forEach(([k, p]) => {
    (groups[p.groupe] = groups[p.groupe] || []).push(k);
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, Object.entries(groups).map(([g, keys]) => /*#__PURE__*/React.createElement("div", {
    key: g
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 10px var(--font-mono)',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 6
    }
  }, g), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4
    }
  }, keys.map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    title: k,
    onClick: () => onChange(k),
    style: {
      width: 38,
      height: 38,
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      background: value === k ? 'var(--papier-2)' : '#fff',
      border: '1px solid ' + (value === k ? 'var(--encre)' : 'var(--filet)'),
      color,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      display: 'block'
    },
    dangerouslySetInnerHTML: {
      __html: pictos[k].svg.replace('width="24" height="24"', 'width="22" height="22"')
    }
  })))))));
}
function Form({
  c,
  set,
  pictos,
  onAddPicto
}) {
  const f = (k, type = 'text') => ({
    value: c[k] ?? '',
    onChange: e => set({
      [k]: type === 'number' ? e.target.value === '' ? '' : Number(e.target.value) : e.target.value
    }),
    type
  });
  const auto = () => {
    const [d, m, y] = String(c.bottledOn || '').split('/');
    if (!y) return;
    set({
      bestBefore: m + '/' + (Number(y) + 1),
      lot: 'L' + y.slice(2) + m + '-' + c.brew
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Cuv\xE9e"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Nom",
    span: true,
    hint: "Coup\xE9 en 2 lignes ; la 2e partie passe en italique couleur."
  }, /*#__PURE__*/React.createElement("input", f('name'))), /*#__PURE__*/React.createElement(Field, {
    label: "2e ligne impos\xE9e",
    hint: "optionnel \u2014 ex. \xAB 2025 \xBB"
  }, /*#__PURE__*/React.createElement("input", f('edition'))), /*#__PURE__*/React.createElement(Field, {
    label: "Style"
  }, /*#__PURE__*/React.createElement("input", f('styleName'))), /*#__PURE__*/React.createElement(Field, {
    label: "D\xE9nomination l\xE9gale",
    span: true,
    hint: 'Vide = « Bière ' + (c.styleName || '…') + ' »'
  }, /*#__PURE__*/React.createElement("input", f('denomination'))), /*#__PURE__*/React.createElement(Field, {
    label: "Brassin N\xB0"
  }, /*#__PURE__*/React.createElement("input", f('brew', 'number'))), /*#__PURE__*/React.createElement(Field, {
    label: "Alcool % vol."
  }, /*#__PURE__*/React.createElement("input", _extends({
    step: "0.1"
  }, f('abv', 'number')))), /*#__PURE__*/React.createElement(Field, {
    label: "EBC (couleur)"
  }, /*#__PURE__*/React.createElement("input", f('ebc', 'number'))), /*#__PURE__*/React.createElement(Field, {
    label: "IBU (amertume)"
  }, /*#__PURE__*/React.createElement("input", f('ibu', 'number')))), /*#__PURE__*/React.createElement(Section, {
    title: "Ingr\xE9dients"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Malts",
    span: true,
    hint: "Allerg\xE8nes entre *ast\xE9risques* \u2192 *Orge*, *bl\xE9*, *avoine*\u2026"
  }, /*#__PURE__*/React.createElement("textarea", _extends({
    rows: "2"
  }, f('malts')))), /*#__PURE__*/React.createElement(Field, {
    label: "Houblons",
    span: true
  }, /*#__PURE__*/React.createElement("textarea", _extends({
    rows: "2"
  }, f('hops')))), /*#__PURE__*/React.createElement(Field, {
    label: "Levure"
  }, /*#__PURE__*/React.createElement("input", f('yeast'))), /*#__PURE__*/React.createElement(Field, {
    label: "Autres",
    hint: "Toujours citer l'eau"
  }, /*#__PURE__*/React.createElement("input", f('other')))), /*#__PURE__*/React.createElement(Section, {
    title: "Dates & lot"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Mise en bouteille",
    hint: "JJ/MM/AAAA"
  }, /*#__PURE__*/React.createElement("input", f('bottledOn'))), /*#__PURE__*/React.createElement(Field, {
    label: " "
  }, /*#__PURE__*/React.createElement("button", {
    onClick: auto,
    style: {
      padding: '8px 10px',
      border: '1px solid var(--encre)',
      background: '#fff',
      cursor: 'pointer',
      font: '600 11px var(--font-text)',
      letterSpacing: '.12em',
      textTransform: 'uppercase'
    }
  }, "Calculer DDM + lot")), /*#__PURE__*/React.createElement(Field, {
    label: "DDM (fin)",
    hint: "MM/AAAA"
  }, /*#__PURE__*/React.createElement("input", f('bestBefore'))), /*#__PURE__*/React.createElement(Field, {
    label: "Lot"
  }, /*#__PURE__*/React.createElement("input", f('lot')))), /*#__PURE__*/React.createElement(Section, {
    title: "Couleur & picto"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, PALETTE.map(([n, h]) => /*#__PURE__*/React.createElement("button", {
    key: n,
    title: n,
    onClick: () => set({
      accent: h
    }),
    style: {
      width: 30,
      height: 30,
      background: h,
      border: c.accent === h ? '2px solid var(--encre)' : '2px solid #fff',
      outline: '1px solid var(--filet)',
      cursor: 'pointer',
      padding: 0
    }
  })), /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: c.accent,
    onChange: e => set({
      accent: e.target.value
    }),
    style: {
      width: 40,
      height: 32,
      padding: 2
    },
    title: "Couleur libre"
  })), /*#__PURE__*/React.createElement(PictoPicker, {
    value: c.picto,
    onChange: k => set({
      picto: k
    }),
    pictos: pictos,
    color: c.accent
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Ajouter mon picto (SVG)",
    span: true,
    hint: "Un SVG au trait avec stroke=\"currentColor\" prend la couleur de cuv\xE9e."
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".svg,image/svg+xml",
    onChange: e => {
      const file = e.target.files[0];
      if (file) file.text().then(t => onAddPicto(file.name.replace(/\.svg$/i, ''), t));
      e.target.value = '';
    }
  }))));
}
Object.assign(window, {
  Form,
  PALETTE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "outils/editeur/Form.jsx", error: String((e && e.message) || e) }); }

// outils/editeur/assets-v2.js
try { (() => {
/* Logos et pictogrammes légaux intégrés (pour la version hors ligne). Sources : assets/ */
window.BY_ASSETS = {
  "logoSrc": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%227%200%2086%20105%22%20role%3D%22img%22%20aria-label%3D%22Brasse-Yutz%20%E2%80%94%20Saint%20Nicolas%22%20xmlns%3Ac2pa%3D%22http%3A%2F%2Fc2pa.org%2Fmanifest%22%3E%3Cmetadata%3E%3Cc2pa%3Amanifest%3EAAAWgmp1bWIAAAAeanVtZGMycGEAEQAQgAAAqgA4m3EDYzJwYQAAABZcanVtYgAAAEdqdW1kYzJtYQARABCAAACqADibcQN1cm46YzJwYTowNGQ3ZjkwOC1lZDViLTQ2ZTItODI0Yy1iMzdjMjQ0NTJlNTEAAAADl2p1bWIAAAApanVtZGMyYXMAEQAQgAAAqgA4m3EDYzJwYS5hc3NlcnRpb25zAAAAALxqdW1iAAAARGp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuaW5ncmVkaWVudC52MwAAAAAYYzJzaN%2BXraRF%2FV5Yjjn0xru1PrUAAABwY2JvcqNpZGM6Zm9ybWF0bWltYWdlL3N2Zyt4bWxqaW5zdGFuY2VJRHgseG1wOmlpZDo1MTllYWVlOC0zOTY0LTRhNjgtOGU0My1kM2I3YTQ0YjMyZWFscmVsYXRpb25zaGlwaHBhcmVudE9mAAAB4mp1bWIAAABBanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5hY3Rpb25zLnYyAAAAABhjMnNozX2RlPSjaK5S8xcqYBpcKQAAAZljYm9yomdhY3Rpb25zgqJmYWN0aW9ua2MycGEub3BlbmVkanBhcmFtZXRlcnOha2luZ3JlZGllbnRzgaJjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFggBhcPe4OoySHSWeSaI3RgorjYg35s%2BMYhI8bIO2Um9H2kZmFjdGlvbngdY29tLmFudGhyb3BpYy5jbGF1ZGUucHJvdmlkZWRqcGFyYW1ldGVyc6F4H2NvbS5hbnRocm9waWMub3JpZ2luLWNvbmZpZGVuY2VndW5rbm93bmtkZXNjcmlwdGlvbnhmQ2xhdWRlIHByb3ZpZGVkIHRoaXMgZmlsZSBhdCB0aGUgcmVxdWVzdCBvZiBhIHVzZXIgYW5kIG1heSBoYXZlIGNyZWF0ZWQgb3IgbW9kaWZpZWQgdGhlIGZpbGUgY29udGVudHMubXNvZnR3YXJlQWdlbnShZG5hbWVmQ2xhdWRlcmFsbEFjdGlvbnNJbmNsdWRlZPUAAADIanVtYgAAAEBqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmhhc2guZGF0YQAAAAAYYzJzaHWCoALwBVZLZl%2BHBYsCgpsAAACAY2JvcqVjYWxnZnNoYTI1NmNwYWRNAAAAAAAAAAAAAAAAAGRoYXNoWCAVfn4Tie5yWdeKU04KWRxqCb9mQp9RUJ6o8eYzx%2BPNv2RuYW1lbmp1bWJmIG1hbmlmZXN0amV4Y2x1c2lvbnOBomVzdGFydBiyZmxlbmd0aBkeBAAAAj5qdW1iAAAAJ2p1bWRjMmNsABEAEIAAAKoAOJtxA2MycGEuY2xhaW0udjIAAAACD2Nib3KlY2FsZ2ZzaGEyNTZpc2lnbmF0dXJleE1zZWxmI2p1bWJmPS9jMnBhL3VybjpjMnBhOjA0ZDdmOTA4LWVkNWItNDZlMi04MjRjLWIzN2MyNDQ1MmU1MS9jMnBhLnNpZ25hdHVyZWppbnN0YW5jZUlEeCx4bXA6aWlkOjEwMThjNjI3LWQxYWMtNGJkZS1iM2ExLWJhOTQyNjBiMjVhNHJjcmVhdGVkX2Fzc2VydGlvbnODomN1cmx4LXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaW5ncmVkaWVudC52M2RoYXNoWCAGFw97g6jJIdJZ5JojdGCiuNiDfmz4xiEjxsg7ZSb0faJjdXJseCpzZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmFjdGlvbnMudjJkaGFzaFgg98O%2BYUItECfvLGS1wa0%2BpgnywqxhSQFpJ3w2iA5OmSqiY3VybHgpc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5oYXNoLmRhdGFkaGFzaFggPMg%2B3C%2F2CxuLQmgkt0MOBHey9%2FaNtvdj4dS4RfmTLvB0Y2xhaW1fZ2VuZXJhdG9yX2luZm%2BjZG5hbWVvQW50aHJvcGljIEZpbGVzZ3ZlcnNpb25lMS4wLjBrc3BlY1ZlcnNpb25lMi40LjAAABA4anVtYgAAAChqdW1kYzJjcwARABCAAACqADibcQNjMnBhLnNpZ25hdHVyZQAAABAIY2JvctKEWQISogEmGCFZAgowggIGMIIBjaADAgECAhRA5aAK7sI50L64g%2FoGQgU9Z1UTADAKBggqhkjOPQQDAzBJMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEuMCwGA1UEAxMlQW50aHJvcGljIENvbnRlbnQgQ3JlZGVudGlhbHMgUm9vdCBDQTAeFw0yNjA4MDcxODQzNTZaFw0yODA4MDYxOTQzNTZaMEQxFzAVBgNVBAoTDkFudGhyb3BpYywgUEJDMSkwJwYDVQQDEyBBbnRocm9waWMgQ2xhdWRlIENvbnRlbnQgU2lnbmluZzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJh6CmvLUBgFFNU0vUKlOVtE6djd17L5SuwX0LemFisBM3dkd%2F3cyjxFA3Qo5S46fX0%2FihY0VZ7mfb9KF703t5OjWDBWMA4GA1UdDwEB%2FwQEAwIHgDAVBgNVHSUEDjAMBgorBgEEAYPoXgIBMAwGA1UdEwEB%2FwQCMAAwHwYDVR0jBBgwFoAUzlHiBIFOZFsj%2BOPEz5o%2BnMHXXMIwCgYIKoZIzj0EAwMDZwAwZAIwMXMdFJ4BetLLVY7ORuE9noqbbAZOZn%2FaArXyTwFAZfKrPzxF2vPoJNf1%2BUCdg1XGAjBwX1zd9WGqYkqmL5SFqw1QySjr1zJfpJM9%2B1rdDwSPLMOPOjKuiXjoU%2FpUUeG9RwmhY3BhZFkNngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPZYQIb%2F%2Bj72HFqLGqDcJQ2NniU89LWMNaYtOoD2XPSqLQbBh4gOKZVCJGaQE63DcOAWd%2FnZ5toNxd2JAACVkfU%2F7Mc%3D%3C%2Fc2pa%3Amanifest%3E%3C%2Fmetadata%3E%3Ctitle%3EBrasse-Yutz%20%E2%80%94%20Saint%20Nicolas%3C%2Ftitle%3E%3Cdefs%3E%3Cmask%20id%3D%22m%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%22-5%22%20width%3D%22100%22%20height%3D%22115%22%3E%3Crect%20x%3D%220%22%20y%3D%22-5%22%20width%3D%22100%22%20height%3D%22115%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Cpath%20d%3D%22M30%2052V36Q30%2016%2050%203Q70%2016%2070%2036V52Z%22%20fill%3D%22%23fff%22%20stroke%3D%22%23000%22%20stroke-width%3D%225%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M30%2052V36Q30%2016%2050%203Q70%2016%2070%2036V52Z%22%20fill%3D%22%23fff%22%3E%3C%2Fpath%3E%3Cg%20fill%3D%22%23000%22%3E%3Crect%20x%3D%2248.4%22%20y%3D%2214%22%20width%3D%223.2%22%20height%3D%2229%22%3E%3C%2Frect%3E%3Crect%20x%3D%2243.5%22%20y%3D%2220%22%20width%3D%2213%22%20height%3D%223%22%3E%3C%2Frect%3E%3Crect%20x%3D%2240.5%22%20y%3D%2228%22%20width%3D%2219%22%20height%3D%223%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cpath%20d%3D%22M42%2080Q42%2095.84%2050%20102Q58%2095.84%2058%2080Z%22%20fill%3D%22%23fff%22%20stroke%3D%22%23000%22%20stroke-width%3D%222.6%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M35%2068Q35%2082.4%2042.5%2088Q50%2082.4%2050%2068Z%22%20fill%3D%22%23fff%22%20stroke%3D%22%23000%22%20stroke-width%3D%222.6%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M50%2068Q50%2082.4%2057.5%2088Q65%2082.4%2065%2068Z%22%20fill%3D%22%23fff%22%20stroke%3D%22%23000%22%20stroke-width%3D%222.6%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M28%2058Q28%2070.96%2035.35%2076Q42.7%2070.96%2042.7%2058Z%22%20fill%3D%22%23fff%22%20stroke%3D%22%23000%22%20stroke-width%3D%222.6%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M42.7%2058Q42.7%2070.96%2050%2076Q57.3%2070.96%2057.3%2058Z%22%20fill%3D%22%23fff%22%20stroke%3D%22%23000%22%20stroke-width%3D%222.6%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M57.3%2058Q57.3%2070.96%2064.65%2076Q72%2070.96%2072%2058Z%22%20fill%3D%22%23fff%22%20stroke%3D%22%23000%22%20stroke-width%3D%222.6%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3C%2Fmask%3E%3C%2Fdefs%3E%3Cg%20mask%3D%22url(%23m)%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2258%22%20r%3D%2240%22%20fill%3D%22none%22%20stroke%3D%22%23D9480F%22%20stroke-width%3D%222.6%22%3E%3C%2Fcircle%3E%3Cpath%20d%3D%22M30%2052V36Q30%2016%2050%203Q70%2016%2070%2036V52Z%22%20fill%3D%22%23161616%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M42%2080Q42%2095.84%2050%20102Q58%2095.84%2058%2080Z%22%20fill%3D%22%23161616%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M35%2068Q35%2082.4%2042.5%2088Q50%2082.4%2050%2068Z%22%20fill%3D%22%23161616%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M50%2068Q50%2082.4%2057.5%2088Q65%2082.4%2065%2068Z%22%20fill%3D%22%23161616%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M28%2058Q28%2070.96%2035.35%2076Q42.7%2070.96%2042.7%2058Z%22%20fill%3D%22%23161616%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M42.7%2058Q42.7%2070.96%2050%2076Q57.3%2070.96%2057.3%2058Z%22%20fill%3D%22%23161616%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M57.3%2058Q57.3%2070.96%2064.65%2076Q72%2070.96%2072%2058Z%22%20fill%3D%22%23161616%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E",
  "pregnancySrc": "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%3F%3E%3Csvg%20version%3D%221.0%22%20width%3D%22280.28375%22%20height%3D%22283.75751%22%20id%3D%22svg3511%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Ac2pa%3D%22http%3A%2F%2Fc2pa.org%2Fmanifest%22%3E%0A%20%20%0A%20%20%3Cdefs%20id%3D%22defs3513%22%3E%0A%20%20%20%20%3CclipPath%20id%3D%22clipPath3475%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22m%2091.1329%2C33.0117%20216.7976%2C0%200%2C216.7993%20-216.7976%2C0%22%20id%3D%22path3477%22%3E%3C%2Fpath%3E%0A%20%20%20%20%3C%2FclipPath%3E%0A%20%20%20%20%3CclipPath%20id%3D%22clipPath3467%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22m%2086.0394%2C29.3103%20227.006%2C0%200%2C224.227%20-227.006%2C0%200%2C-224.227%20z%22%20id%3D%22path3469%22%3E%3C%2Fpath%3E%0A%20%20%20%20%3C%2FclipPath%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Cmetadata%20id%3D%22metadata3516%22%3E%3Cc2pa%3Amanifest%3EAAAWgmp1bWIAAAAeanVtZGMycGEAEQAQgAAAqgA4m3EDYzJwYQAAABZcanVtYgAAAEdqdW1kYzJtYQARABCAAACqADibcQN1cm46YzJwYTowOThlNWZkMi1mNGI0LTRhYjEtYWU1My05YTAyN2MyN2MyYmQAAAADl2p1bWIAAAApanVtZGMyYXMAEQAQgAAAqgA4m3EDYzJwYS5hc3NlcnRpb25zAAAAALxqdW1iAAAARGp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuaW5ncmVkaWVudC52MwAAAAAYYzJzaG4OPAdynAUUCg2WQ9gOQcIAAABwY2JvcqNpZGM6Zm9ybWF0bWltYWdlL3N2Zyt4bWxqaW5zdGFuY2VJRHgseG1wOmlpZDoyZDZhMjA4Yi1lNWViLTQ3ZjAtOWNkOS03ZmZjYmViNmFiYTdscmVsYXRpb25zaGlwaHBhcmVudE9mAAAB4mp1bWIAAABBanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5hY3Rpb25zLnYyAAAAABhjMnNoCYuBvjaJ9BKgpqDFce9BPAAAAZljYm9yomdhY3Rpb25zgqJmYWN0aW9ua2MycGEub3BlbmVkanBhcmFtZXRlcnOha2luZ3JlZGllbnRzgaJjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFggo5ld50KlGhAHPsc5m3j1SjJqqtIvqBTRtYYFAuKKNeCkZmFjdGlvbngdY29tLmFudGhyb3BpYy5jbGF1ZGUucHJvdmlkZWRqcGFyYW1ldGVyc6F4H2NvbS5hbnRocm9waWMub3JpZ2luLWNvbmZpZGVuY2VndW5rbm93bmtkZXNjcmlwdGlvbnhmQ2xhdWRlIHByb3ZpZGVkIHRoaXMgZmlsZSBhdCB0aGUgcmVxdWVzdCBvZiBhIHVzZXIgYW5kIG1heSBoYXZlIGNyZWF0ZWQgb3IgbW9kaWZpZWQgdGhlIGZpbGUgY29udGVudHMubXNvZnR3YXJlQWdlbnShZG5hbWVmQ2xhdWRlcmFsbEFjdGlvbnNJbmNsdWRlZPUAAADIanVtYgAAAEBqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmhhc2guZGF0YQAAAAAYYzJzaIaXAnLWEpnhzC5VfICfeFkAAACAY2JvcqVjYWxnZnNoYTI1NmNwYWRMAAAAAAAAAAAAAAAAZGhhc2hYILjNtB69i8CsKZUQTNuruQ91Vx9gJDWzVcBoTBnz8kwgZG5hbWVuanVtYmYgbWFuaWZlc3RqZXhjbHVzaW9uc4GiZXN0YXJ0GQIVZmxlbmd0aBkeBAAAAj5qdW1iAAAAJ2p1bWRjMmNsABEAEIAAAKoAOJtxA2MycGEuY2xhaW0udjIAAAACD2Nib3KlY2FsZ2ZzaGEyNTZpc2lnbmF0dXJleE1zZWxmI2p1bWJmPS9jMnBhL3VybjpjMnBhOjA5OGU1ZmQyLWY0YjQtNGFiMS1hZTUzLTlhMDI3YzI3YzJiZC9jMnBhLnNpZ25hdHVyZWppbnN0YW5jZUlEeCx4bXA6aWlkOmVjN2ZkNzFkLTQzZmMtNDYwZC1iZDViLTRkMjIwNWFhNTE4MXJjcmVhdGVkX2Fzc2VydGlvbnODomN1cmx4LXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaW5ncmVkaWVudC52M2RoYXNoWCCjmV3nQqUaEAc%2BxzmbePVKMmqq0i%2BoFNG1hgUC4oo14KJjdXJseCpzZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmFjdGlvbnMudjJkaGFzaFggrEWQkaOZMi77k%2BarJvuM48UCYY%2BJUt2s%2Fez6NdclZvaiY3VybHgpc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5oYXNoLmRhdGFkaGFzaFggJ%2BG2qZtgUJZdWhu6oZKAc7wQ7oXMvxDayB9eeBrGred0Y2xhaW1fZ2VuZXJhdG9yX2luZm%2BjZG5hbWVvQW50aHJvcGljIEZpbGVzZ3ZlcnNpb25lMS4wLjBrc3BlY1ZlcnNpb25lMi40LjAAABA4anVtYgAAAChqdW1kYzJjcwARABCAAACqADibcQNjMnBhLnNpZ25hdHVyZQAAABAIY2JvctKEWQISogEmGCFZAgowggIGMIIBjaADAgECAhRA5aAK7sI50L64g%2FoGQgU9Z1UTADAKBggqhkjOPQQDAzBJMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEuMCwGA1UEAxMlQW50aHJvcGljIENvbnRlbnQgQ3JlZGVudGlhbHMgUm9vdCBDQTAeFw0yNjA4MDcxODQzNTZaFw0yODA4MDYxOTQzNTZaMEQxFzAVBgNVBAoTDkFudGhyb3BpYywgUEJDMSkwJwYDVQQDEyBBbnRocm9waWMgQ2xhdWRlIENvbnRlbnQgU2lnbmluZzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJh6CmvLUBgFFNU0vUKlOVtE6djd17L5SuwX0LemFisBM3dkd%2F3cyjxFA3Qo5S46fX0%2FihY0VZ7mfb9KF703t5OjWDBWMA4GA1UdDwEB%2FwQEAwIHgDAVBgNVHSUEDjAMBgorBgEEAYPoXgIBMAwGA1UdEwEB%2FwQCMAAwHwYDVR0jBBgwFoAUzlHiBIFOZFsj%2BOPEz5o%2BnMHXXMIwCgYIKoZIzj0EAwMDZwAwZAIwMXMdFJ4BetLLVY7ORuE9noqbbAZOZn%2FaArXyTwFAZfKrPzxF2vPoJNf1%2BUCdg1XGAjBwX1zd9WGqYkqmL5SFqw1QySjr1zJfpJM9%2B1rdDwSPLMOPOjKuiXjoU%2FpUUeG9RwmhY3BhZFkNngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPZYQGG%2Fm%2FPucYsC63%2B6Yj%2FEzGlUKQmNDpEaOrWeNzfL%2FuTygGPzRY1id9pJQBt5n20kiBO7POFAIoJCwYiyd4ezBm0%3D%3C%2Fc2pa%3Amanifest%3E%0A%20%20%20%20%0A%20%20%3C%2Fmetadata%3E%0A%20%20%3Cg%20transform%3D%22translate(-168.43%2C-301.912)%22%20id%3D%22layer1%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22m%20284.35793%2C142.33615%20a%20133.8452%2C128.28938%200%201%201%20-267.690404%2C0%20133.8452%2C128.28938%200%201%201%20267.690404%2C0%20z%22%20transform%3D%22matrix(0.97735849%2C0%2C0%2C1%2C161.73631%2C301.912)%22%20id%3D%22path3018%22%20style%3D%22fill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke-width%3A5%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%22%3E%3C%2Fpath%3E%0A%20%20%20%20%3Cg%20transform%3D%22matrix(0%2C1.25%2C1.25%2C0%2C131.792%2C194.363)%22%20id%3D%22g3463%22%20style%3D%22fill%3A%234A4A48%22%3E%0A%20%20%20%20%20%20%3Cg%20clip-path%3D%22url(%23clipPath3467)%22%20id%3D%22g3465%22%20style%3D%22fill%3A%234A4A48%22%3E%0A%20%20%20%20%20%20%20%20%3Cg%20id%3D%22g3471%22%20style%3D%22display%3Ainline%3Bfill%3A%234A4A48%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cg%20clip-path%3D%22url(%23clipPath3475)%22%20id%3D%22g3473%22%20style%3D%22fill%3A%234A4A48%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m%20133.58%2C183.5368%20c%20-0.7242%2C-0.5831%201.1151%2C-4.0538%204.1062%2C-7.7505%202.9918%2C-3.6926%206.0032%2C-6.2099%206.7298%2C-5.6218%200.7233%2C0.5863%20-1.1176%2C4.0545%20-4.107%2C7.7479%20-2.9959%2C3.6967%20-6.0065%2C6.2115%20-6.729%2C5.6244%20z%22%20id%3D%22path3479%22%20style%3D%22fill%3A%234A4A48%3Bstroke%3A%234A4A48%3Bstroke-width%3A0.9872%3Bstroke-linecap%3Abutt%3Bstroke-linejoin%3Amiter%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-opacity%3A1%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m%20155.028%2C195.5962%206.421%2C-7.9257%20-17.0037%2C-17.4668%20c%200.6223%2C0.6764%20-1.1983%2C4.0846%20-4.1363%2C7.7087%20-2.9959%2C3.6967%20-6.0065%2C6.2115%20-6.729%2C5.6244%20l%2021.5343%2C12.1294%22%20id%3D%22path3481%22%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bfill-rule%3Anonzero%3Bstroke%3Anone%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m%20155.1208%2C195.6587%20c%20-0.4521%2C-0.367%200.606%2C-2.4264%202.3671%2C-4.5934%201.7578%2C-2.1795%203.5514%2C-3.64%204.0059%2C-3.2738%200.4513%2C0.3678%20-0.6044%2C2.4272%20-2.3687%2C4.5992%20-1.7562%2C2.1729%20-3.5498%2C3.6325%20-4.0043%2C3.268%22%20id%3D%22path3483%22%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bfill-rule%3Anonzero%3Bstroke%3Anone%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m%20155.1208%2C195.6587%20c%20-0.4521%2C-0.367%200.606%2C-2.4264%202.3671%2C-4.5934%201.7578%2C-2.1795%203.5514%2C-3.64%204.0059%2C-3.2738%200.4513%2C0.3678%20-0.6044%2C2.4272%20-2.3687%2C4.5992%20-1.7562%2C2.1729%20-3.5498%2C3.6325%20-4.0043%2C3.268%20z%22%20id%3D%22path3485%22%20style%3D%22fill%3A%234A4A48%3Bstroke%3A%234A4A48%3Bstroke-width%3A0.1647%3Bstroke-linecap%3Abutt%3Bstroke-linejoin%3Amiter%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-opacity%3A1%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m%20136.997%2C100.5666%20c%204.1265%2C-0.5283%2022.5452%2C0.9786%2030.9301%2C8.1666%202.0796%2C1.7818%203.1629%2C2.9744%203.6834%2C3.7336%200.198%2C-0.2408%200.5409%2C-0.4962%201.1103%2C-0.7405%204.1926%2C-1.7929%2010.5818%2C-7.1628%2018.7401%2C-13.4666%2013.0095%2C-10.0527%2021.4072%2C-11.8269%2021.4072%2C-11.8269%200%2C0%201.0635%2C-0.3547%201.5373%2C0.3548%200.4729%2C0.7095%202.9635%2C2.0473%206.1364%2C7.5098%202.7209%2C3.7844%205.0113%2C9.1661%208.0558%2C18.0316%201.7391%2C5.0653%201.7616%2C16.7135%207.622%2C17.3691%2010.4729%2C1.1711%2016.3542%2C-8.1125%2025.4926%2C-10.1135%2011.2562%2C-2.4656%2024.8253%2C5.3233%2029.02%2C8.3185%201.885%2C1.3479%205.7119%2C1.3604%209.3519%2C0.9676%20l%200.3729%2C30.5889%20-4.2915%2C23.6042%20c%20-9.3511%2C-4.2789%20-19.2443%2C-10.6856%20-19.2443%2C-10.6856%20-19.5347%2C36.8747%20-45.3425%2C21.3788%20-58.5072%2C8.4502%20-3.3047%2C-2.3179%20-5.4992%2C-4.1229%20-5.4992%2C-4.1229%200%2C0%200.7549%2C1.5089%201.2562%2C3.0169%200.5088%2C1.5106%200.8833%2C3.7701%201.3846%2C5.9121%200.5046%2C2.1386%200.4663%2C3.1387%20-0.4121%2C4.3999%20-0.8824%2C1.2578%20-2.8618%2C1.7541%20-4.8669%2C2.1395%20-1.2353%2C0.2377%20-7.4235%2C2.3897%20-11.1928%2C3.268%20-3.776%2C0.8824%20-12.3289%2C2.3913%20-16.6053%2C3.0169%20-4.2739%2C0.6289%20-10.1853%2C0.3828%20-17.4772%2C1.388%20-7.2984%2C1.0084%20-10.6951%2C-1.6357%20-11.4477%2C-1.5089%20-0.7559%2C0.1209%20-3.0188%2C-1.0085%20-3.3967%2C-1.8893%20-0.3763%2C-0.8783%200.3779%2C-1.634%200.3779%2C-1.634%200%2C0%20-1.1354%2C-0.251%20-1.3847%2C-1.5089%20-0.25%2C-1.2561%200.3771%2C-1.7608%20-0.5018%2C-2.0118%20-0.8837%2C-0.2527%20-1.0035%2C-1.7591%20-0.5033%2C-2.7676%200.5033%2C-1.0051%202.6407%2C-0.7532%200.8797%2C-1.5089%20-1.7602%2C-0.754%20-1.7602%2C-2.2645%20-2.0104%2C-3.6508%20-0.2524%2C-1.3763%2010.5615%2C-1.0018%2010.5615%2C-1.0018%200%2C0%202.8966%2C0.0568%204.4035%2C1.3863%201.1388%2C1.0059%201.4312%2C2.3088%203.2712%2C4.2714%201.3628%2C1.453%202.1928%2C1.453%204.4019%2C1.7633%202.4924%2C0.3495%207.7957%2C-1.6357%2013.0797%2C-2.3922%205.2807%2C-0.754%2013.7093%2C-6.5377%2013.7093%2C-6.5377%200%2C0%20-1.1336%2C-1.508%20-2.3881%2C-2.7692%20-1.2578%2C-1.2578%20-9.8123%2C-11.6949%20-11.0676%2C-12.9527%20-1.2612%2C-1.2561%20-8.4278%2C-7.1682%20-10.4417%2C-9.5596%20-2.0119%2C-2.3864%20-3.7225%2C-7.6913%20-3.7225%2C-7.6913%20-1.3309%2C-2.1303%20-6.9253%2C-3.5924%20-10.783%2C-2.795%20-3.8626%2C0.7982%20-5.0527%2C5.0905%20-5.1577%2C7.7037%20-0.211%2C5.2298%20-1.3%2C6.2024%20-2.0681%2C6.3909%20-0.7698%2C0.1952%20-4.4239%2C-0.3812%20-4.4239%2C-0.3812%200%2C0%20-0.3323%2C1.297%20-0.72%2C1.4872%20-0.3829%2C0.196%20-1.538%2C-0.0434%20-1.7766%2C-0.6239%20-0.2387%2C-0.5714%20-0.7225%2C-0.9133%20-0.6264%2C-0.5714%200.0961%2C0.3303%20-0.769%2C1.1953%20-1.1518%2C1.3421%20-0.3861%2C0.1435%20-0.5767%2C-0.8157%20-1.0572%2C-0.9142%20-0.479%2C-0.0976%20-1.1681%2C1.1411%20-1.1681%2C1.1411%20-0.2672%2C0.7999%20-0.5377%2C2.4055%20-1.608%2C2.6775%20-1.0703%2C0.2685%20-2.1414%2C-0.8058%20-3.4814%2C-1.8776%20-1.3423%2C-1.0727%20-4.0222%2C-2.9461%20-5.899%2C-2.6766%20-1.8718%2C0.2669%20-6.6955%2C0%20-11.2521%2C-2.4148%20-3.3226%2C-2.167%20-4.1518%2C-2.7483%20-7.2268%2C-6.3032%20-3.061%2C-3.5391%20-4.4416%2C-13.2247%20-2.235%2C-22.4449%201.8172%2C-7.5944%2012.417%2C-9.301%2012.417%2C-9.301%20-2.5137%2C-2.5138%20-0.9319%2C-15.3312%2016.3936%2C-17.7552%20z%20m%2072.6798%2C6.3265%20c%200%2C0%20-7.6069%2C9.0282%20-10.5972%2C11.4287%200%2C0%202.3964%2C2.3939%204.7894%2C3.5891%202.398%2C1.1995%206.5877%2C3.5958%208.9883%2C4.1947%202.3938%2C0.6031%206.5885%2C1.1995%206.5885%2C1.1995%202.705%2C0.5822%202.529%2C0.2852%20-1.7975%2C-5.3942%20-4.7985%2C-4.8519%20-7.3801%2C-13.1255%20-7.9715%2C-15.0178%20z%20m%20-60.8215%2C14.1145%20c%20-2.1529%2C-0.6031%20-8.2661%2C-1.7224%20-8.2661%2C-1.7224%203.9033%2C0.709%206.233%2C6.4392%206.233%2C6.4392%200%2C0%201.269%2C1.4756%202.745%2C1.6883%201.4776%2C0.2101%205.9112%2C-0.6373%207.1778%2C-1.4764%201.2658%2C-0.8449%201.6927%2C-2.3238%201.6927%2C-2.3238%20-1.7009%2C0.7957%20-6.0522%2C-1.3996%20-9.5824%2C-2.6049%22%20id%3D%22path3487%22%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bfill-rule%3Anonzero%3Bstroke%3Anone%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m%20290.6071%2C196.5754%207.3651%2C-11.1961%20-175.1516%2C-114.717%20-7.3635%2C11.1936%20175.15%2C114.7195%22%20id%3D%22path3489%22%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bfill-rule%3Anonzero%3Bstroke%3Anone%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m%2091.1329%2C141.413%20c%200%2C-59.8711%2048.5309%2C-108.4013%20108.3988%2C-108.4013%2059.8667%2C0%20108.3988%2C48.5302%20108.3988%2C108.4013%200%2C59.8667%20-48.5321%2C108.398%20-108.3988%2C108.398%20-59.8679%2C0%20-108.3988%2C-48.5313%20-108.3988%2C-108.398%20z%20m%20205.5423%2C0%20c%200%2C-53.5665%20-43.5793%2C-97.1442%20-97.1435%2C-97.1442%20-53.5648%2C0%20-97.1433%2C43.5777%20-97.1433%2C97.1442%200%2C53.5618%2043.5785%2C97.1393%2097.1433%2C97.1393%2053.5642%2C0%2097.1435%2C-43.5775%2097.1435%2C-97.1393%22%20id%3D%22path3491%22%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bfill-rule%3Anonzero%3Bstroke%3Anone%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m%20125.3644%2C117.1049%200.1662%2C0.9133%20c%200%2C0%205.7011%2C-1.4513%208.7719%2C-0.4554%20-1.8262%2C-1.2453%20-6.6973%2C-1.2881%20-8.9381%2C-0.4579%22%20id%3D%22path3493%22%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bfill-rule%3Anonzero%3Bstroke%3Anone%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m%20231.1332%2C126.6803%20c%201.6124%2C0.5739%207.8081%2C2.7993%2013.9695%2C1.5356%20l%20-2.6807%2C2.5632%20-7.2642%2C0.91%20-5.0338%2C-2.2913%200.7557%2C-2.7859%22%20id%3D%22path3495%22%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bfill-rule%3Anonzero%3Bstroke%3Anone%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%3Cpath%20style%3D%22display%3Ainline%3Bfill%3A%234A4A48%3Bfill-opacity%3A1%3Bstroke-width%3A0.346046%22%20d%3D%22M%20131.49738%2C276.96806%20C%20110.69579%2C275.08433%2095.562639%2C270.90863%2078.898429%2C262.45438%2066.186387%2C256.00518%2056.000797%2C248.66768%2045.573407%2C238.44769%2023.420071%2C216.73497%209.9921566%2C189.80213%205.8808861%2C158.83499%204.9651865%2C151.93771%204.6138328%2C139.02568%205.1558259%2C132.18947%206.9821171%2C109.1543%2013.779655%2C88.582851%2025.907834%2C69.387493%2036.264177%2C52.996428%2051.255413%2C38.004764%2067.657264%2C27.636865%2085.569713%2C16.314087%20104.93136%2C9.5895238%20126.47972%2C7.2070203%20c%205.45305%2C-0.6029189%2021.88456%2C-0.6029189%2027.33761%2C0%2026.66785%2C2.9485427%2050.2873%2C12.6731787%2071.1124%2C29.2785077%205.28159%2C4.21139%2015.74293%2C14.578999%2019.92847%2C19.749929%2014.63152%2C18.076156%2024.20966%2C38.739689%2028.30959%2C61.074053%201.67522%2C9.12569%202.09006%2C14.00234%202.09006%2C24.56924%200%2C10.57712%20-0.41733%2C15.47492%20-2.09351%2C24.56925%20-8.19694%2C44.47369%20-38.36344%2C82.09737%20-80.15718%2C99.9721%20-11.48401%2C4.91159%20-24.2959%2C8.28197%20-37.63262%2C9.8999%20-4.45163%2C0.54004%20-20.31534%2C0.97061%20-23.87716%2C0.64806%20z%20m%2024.2039%2C-14.47831%20c%206.42802%2C-0.90931%2012.64317%2C-2.21984%2018.18359%2C-3.8342%205.02541%2C-1.46429%2013.2123%2C-4.40598%2013.74521%2C-4.93889%200.14355%2C-0.14356%20-0.72417%2C-1.73521%20-1.92828%2C-3.53702%20C%20183.31931%2C246.61455%20112.27467%2C138.14226%2078.392891%2C86.338412%2066.816231%2C68.638173%2057.197599%2C54.000438%2057.018154%2C53.810113%2056.806661%2C53.585799%2055.089423%2C55.115096%2052.136587%2C58.157426%2035.80862%2C74.980257%2024.595653%2C97.000109%2020.429192%2C120.42392%20c%20-2.354347%2C13.23612%20-2.355163%2C29.64095%20-0.0021%2C42.90967%206.06434%2C34.19681%2027.187888%2C64.75701%2057.240078%2C82.81129%2015.856515%2C9.52603%2033.52112%2C15.2059%2052.7921%2C16.97478%203.81319%2C0.35002%2021.42103%2C-0.0894%2025.24204%2C-0.62991%20z%20m%2050.23141%2C-18.373%20c%201.40793%2C-0.90013%204.28562%2C-2.91786%206.39488%2C-4.48385%2028.30205%2C-21.01237%2046.01562%2C-52.72571%2048.9605%2C-87.65597%200.52251%2C-6.19778%200.23085%2C-20.15884%20-0.53589%2C-25.65094%20C%20257.55613%2C103.43285%20249.13412%2C83.668078%20234.93945%2C65.748691%20231.19629%2C61.023318%20220.94802%2C50.787493%20216.10557%2C46.937682%20197.14775%2C31.86598%20174.41689%2C22.773764%20150.62697%2C20.746608%20c%20-6.28223%2C-0.535313%20-20.92577%2C-0.246246%20-26.39655%2C0.521074%20-15.1696%2C2.127658%20-29.577324%2C6.848829%20-42.390602%2C13.890696%20-5.425662%2C2.981813%20-12.318699%2C7.48252%20-12.15123%2C7.933971%200.07257%2C0.195637%204.872106%2C7.592365%2010.665635%2C16.437173%205.793532%2C8.844812%2033.891797%2C51.741488%2062.440597%2C95.325948%2028.5488%2C43.58446%2053.66893%2C81.93901%2055.8225%2C85.23234%202.30258%2C3.5212%204.08858%2C5.92148%204.33554%2C5.82671%200.23098%2C-0.0886%201.5719%2C-0.89763%202.97983%2C-1.79777%20z%22%20id%3D%22path2221%22%20transform%3D%22matrix(0%2C0.8%2C0.8%2C0%2C86.0392%2C29.3104)%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%3Cpath%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bstroke-width%3A0.346046%22%20d%3D%22m%20140.84062%2C151.26247%20-51.387796%2C-78.419842%200.0024%2C-5.709754%20c%200.0026%2C-5.969168%200.220152%2C-7.258732%201.985316%2C-11.765555%202.094063%2C-5.346569%205.767527%2C-9.579203%2010.09893%2C-11.636176%203.20936%2C-1.524121%206.22075%2C-1.898103%208.29735%2C-1.030442%200.74255%2C0.310256%201.38758%2C0.523127%201.43341%2C0.473048%200.0458%2C-0.05008%200.57608%2C-1.5704%201.17835%2C-3.378489%201.32786%2C-3.986458%202.36507%2C-5.822274%204.66466%2C-8.256238%203.25606%2C-3.446312%206.55229%2C-4.467687%2015.42224%2C-4.778752%206.36086%2C-0.223073%209.37468%2C0.106124%2013.42779%2C1.466712%203.01515%2C1.012149%204.65219%2C2.07832%207.56008%2C4.923701%203.45383%2C3.379582%206.08146%2C7.696176%207.2758%2C11.952462%200.27564%2C0.982329%200.62152%2C3.81042%200.7686%2C6.284647%200.30268%2C5.091625%200.56619%2C5.818433%203.52854%2C9.732236%202.42633%2C3.205633%202.65397%2C3.763206%201.8838%2C4.614229%20-0.3387%2C0.374259%20-1.18094%2C0.861741%20-1.87164%2C1.083293%20-1.35855%2C0.435768%20-2.46699%2C1.250104%20-2.46699%2C1.812404%200%2C0.193422%200.2417%2C0.618758%200.53712%2C0.945186%200.49089%2C0.542427%200.4569%2C0.656611%20-0.3948%2C1.326566%20l%20-0.93193%2C0.73305%200.91387%2C0.846947%20c%201.19996%2C1.112083%201.15614%2C1.886804%20-0.13427%2C2.373877%20-0.8683%2C0.32775%20-1.01913%2C0.545237%20-0.87907%2C1.267614%200.093%2C0.479592%200.26916%2C1.751427%200.3915%2C2.826301%200.35859%2C3.150798%20-0.66494%2C3.758098%20-7.46147%2C4.427153%20-4.79217%2C0.471744%20-7.59179%2C1.783987%20-9.13349%2C4.281053%20-0.86805%2C1.405984%20-1.05048%2C2.106581%20-1.17141%2C4.498595%20-0.22374%2C4.425748%201.08747%2C9.022434%203.09077%2C10.835274%200.44676%2C0.40428%201.7081%2C1.06407%202.80299%2C1.4662%205.65011%2C2.07513%208.30494%2C4.21799%2015.42068%2C12.44689%202.78079%2C3.2158%205.58471%2C5.8722%2011.31041%2C10.71533%204.18715%2C3.54175%208.60878%2C7.3424%209.82583%2C8.4459%201.21706%2C1.1035%202.34999%2C2.00636%202.51763%2C2.00636%201.06931%2C0%207.24518%2C-12.01811%208.05354%2C-15.67201%203.55104%2C-16.05123%203.72756%2C-17.30245%202.90305%2C-20.57688%20-0.44624%2C-1.7722%20-1.85727%2C-3.293888%20-5.13265%2C-5.535178%20-2.29278%2C-1.568909%20-3.31344%2C-3.381586%20-3.64445%2C-6.472425%20l%20-0.23429%2C-2.187861%20-6.79829%2C-6.764439%20c%20-3.73905%2C-3.720442%20-7.2305%2C-6.928002%20-7.75878%2C-7.127909%20-1.38524%2C-0.524194%20-1.49467%2C-1.239869%20-0.43455%2C-2.841818%202.76796%2C-4.182676%2013.05084%2C-12.065954%2015.73872%2C-12.065954%200.71865%2C0%201.55192%2C0.860697%201.2719%2C1.313771%20-0.104%2C0.168273%202.12445%2C4.418037%204.95209%2C9.443919%204.96509%2C8.824993%205.18413%2C9.148127%206.39525%2C9.434549%200.68973%2C0.16312%201.41741%2C0.601788%201.61705%2C0.974822%200.28687%2C0.536021%200.5805%2C0.630467%201.4003%2C0.450409%201.77442%2C-0.38973%202.3559%2C0.480935%204.28244%2C6.412235%201.14453%2C3.523683%201.48832%2C8.406818%200.90242%2C12.817731%20-0.21386%2C1.610048%20-0.6203%2C6.742508%20-0.90319%2C11.405468%20-0.79643%2C13.12751%20-3.18572%2C26.48316%20-6.90259%2C38.5841%20-0.81844%2C2.66456%20-1.68537%2C5.70111%20-1.92652%2C6.74789%20-0.91434%2C3.96891%20-2.46159%2C5.63686%20-5.19398%2C5.59915%20-1.86299%2C-0.0257%20-9.1912%2C-1.73224%20-11.55944%2C-2.69186%20-1.1264%2C-0.45642%20-2.09234%2C-0.78553%20-2.14653%2C-0.73134%20-0.18456%2C0.18456%204.76444%2C6.63956%207.08697%2C9.24356%208.79245%2C9.85805%2013.75948%2C18.82409%2015.47525%2C27.93459%200.75287%2C3.99759%200.516%2C10.63874%20-0.50325%2C14.10997%20-1.75208%2C5.967%20-6.35599%2C12.9505%20-11.6356%2C17.64959%20l%20-2.42232%2C2.15598%20z%20m%20-21.4195%2C-61.381657%20c%201.45469%2C-0.96891%202.2509%2C-2.547526%202.94631%2C-5.841504%200.64062%2C-3.034489%200.47766%2C-5.55201%20-0.43884%2C-6.779566%20-0.36754%2C-0.492274%20-1.75184%2C-1.554337%20-3.07622%2C-2.360139%20-3.04101%2C-1.850258%20-4.87187%2C-3.596665%20-5.71308%2C-5.44956%20-1.77367%2C-3.906797%200.59634%2C7.171729%202.82048%2C13.18426%201.06856%2C2.888617%201.77664%2C5.384589%201.81153%2C6.385586%200.0315%2C0.903836%200.15104%2C1.643509%200.26563%2C1.643717%200.1146%2C2.07e-4%200.73748%2C-0.35205%201.38419%2C-0.782794%20z%20m%2060.05497%2C-18.274897%20c%202.37666%2C-1.248467%204.93041%2C-3.109335%208.15773%2C-5.944387%202.3798%2C-2.090546%204.91719%2C-5.196781%204.71014%2C-5.766084%20-0.39548%2C-1.08739%20-6.93937%2C2.991122%20-11.24613%2C7.009205%20-2.52528%2C2.356017%20-4.6145%2C4.83294%20-4.6145%2C5.47083%200%2C0.545732%200.95768%2C0.299468%202.99276%2C-0.769564%20z%20m%20-69.32217%2C-13.38372%20c%20-0.16977%2C-2.039799%200.20514%2C-5.89763%200.80711%2C-8.305098%200.16368%2C-0.654609%200.0543%2C-0.778603%20-0.68674%2C-0.778603%20-0.78022%2C0%20-0.90842%2C0.179987%20-1.11648%2C1.567453%20-0.47744%2C3.183797%200.26246%2C9.852057%201.09317%2C9.852057%200.0535%2C0%200.01%2C-1.051114%20-0.0971%2C-2.335809%20z%22%20id%3D%22path2260%22%20transform%3D%22matrix(0%2C0.8%2C0.8%2C0%2C86.0392%2C29.3104)%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%3Cpath%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bstroke-width%3A0.346046%22%20d%3D%22%22%20id%3D%22path2299%22%20transform%3D%22matrix(0%2C0.8%2C0.8%2C0%2C86.0392%2C29.3104)%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%3Cpath%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bstroke-width%3A0.346046%22%20d%3D%22M%20140.84062%2C151.26532%2089.452824%2C72.842628%2089.33912%2C68.237047%20c%20-0.21939%2C-8.886383%202.248921%2C-15.908145%207.414261%2C-21.09182%203.891689%2C-3.905501%209.673099%2C-5.869476%2013.083479%2C-4.444526%200.74255%2C0.310256%201.40904%2C0.505152%201.48109%2C0.433102%200.0721%2C-0.07205%200.42191%2C-1.148262%200.77746%2C-2.391583%201.0237%2C-3.579681%202.66826%2C-6.656874%204.77213%2C-8.929308%203.43728%2C-3.712667%206.60711%2C-4.734882%2015.66798%2C-5.052642%206.36086%2C-0.223073%209.37468%2C0.106124%2013.42779%2C1.466712%203.01515%2C1.012149%204.65219%2C2.07832%207.56008%2C4.923701%203.45383%2C3.379582%206.08146%2C7.696176%207.2758%2C11.952462%200.27564%2C0.982329%200.62152%2C3.81042%200.7686%2C6.284647%200.30252%2C5.088994%200.57684%2C5.847375%203.4897%2C9.647797%202.41718%2C3.153702%202.69854%2C3.841309%201.92264%2C4.698668%20-0.3387%2C0.374259%20-1.18094%2C0.861741%20-1.87164%2C1.083293%20-1.35855%2C0.435768%20-2.46699%2C1.250104%20-2.46699%2C1.812404%200%2C0.193422%200.2417%2C0.618758%200.53712%2C0.945186%200.49089%2C0.542427%200.4569%2C0.656611%20-0.3948%2C1.326566%20l%20-0.93193%2C0.73305%200.91387%2C0.846947%20c%201.19321%2C1.105823%201.15434%2C1.77601%20-0.14187%2C2.446304%20-0.71431%2C0.369383%20-1.00215%2C0.735981%20-0.89001%2C1.133535%200.0911%2C0.323176%200.26849%2C1.547143%200.39409%2C2.71993%200.19953%2C1.863024%200.13942%2C2.221296%20-0.47591%2C2.836627%20-0.89583%2C0.895826%20-2.50685%2C1.317452%20-6.62357%2C1.733461%20-5.31465%2C0.537066%20-8.15371%2C1.885873%20-9.67795%2C4.597872%20-2.00648%2C3.57006%20-0.83228%2C12.303328%202.00355%2C14.901598%200.50958%2C0.46689%201.70511%2C1.13101%202.65674%2C1.47581%205.66763%2C2.05352%207.80488%2C3.72976%2014.78844%2C11.59848%204.88057%2C5.49918%204.55293%2C5.18945%2014.22304%2C13.44578%204.15615%2C3.54852%208.18331%2C6.99244%208.94924%2C7.65315%20l%201.3926%2C1.20129%200.66063%2C-0.81584%20c%201.1303%2C-1.39587%204.48583%2C-7.5371%205.84069%2C-10.68954%200.80276%2C-1.86785%201.70718%2C-4.97715%202.38502%2C-8.19949%200.60055%2C-2.85488%201.39616%2C-6.59218%201.76802%2C-8.3051%200.76762%2C-3.53585%200.86156%2C-6.09827%200.30464%2C-8.31%20-0.41415%2C-1.64473%20-2.44361%2C-3.802558%20-5.61858%2C-5.973957%20-1.95499%2C-1.337037%20-2.83273%2C-3.047964%20-3.18755%2C-6.213327%20l%20-0.24178%2C-2.156858%20-6.82686%2C-6.710959%20c%20-3.75477%2C-3.691027%20-7.2757%2C-6.926084%20-7.82428%2C-7.189013%20-0.54858%2C-0.262926%20-1.04498%2C-0.725001%20-1.10311%2C-1.026832%20-0.29333%2C-1.523138%205.70289%2C-7.531495%2011.13464%2C-11.157179%204.19662%2C-2.801244%206.54574%2C-3.27953%206.64831%2C-1.353618%200.0293%2C0.551315%207.64011%2C14.457678%209.83475%2C17.970066%200.25866%2C0.413968%200.98067%2C0.848414%201.60446%2C0.96544%200.6238%2C0.117023%201.35336%2C0.525699%201.62125%2C0.908166%200.37005%2C0.528325%200.70834%2C0.639863%201.40807%2C0.464241%201.64229%2C-0.412189%202.29716%2C0.594943%204.17827%2C6.425741%201.26154%2C3.910369%201.44019%2C7.522259%200.73885%2C14.937659%20-0.31201%2C3.29896%20-0.72265%2C8.68585%20-0.91252%2C11.97087%20-0.50377%2C8.71577%20-3.20479%2C24.10931%20-5.69177%2C32.43832%20-0.68195%2C2.2839%20-1.77089%2C6.04664%20-2.41985%2C8.36165%20-0.64897%2C2.31501%20-1.42713%2C4.68711%20-1.72924%2C5.27134%20-0.67544%2C1.30615%20-2.31676%2C2.19777%20-4.00288%2C2.1745%20-1.86299%2C-0.0257%20-9.1912%2C-1.73224%20-11.55944%2C-2.69186%20-1.1264%2C-0.45642%20-2.09321%2C-0.78466%20-2.14846%2C-0.7294%20-0.18799%2C0.18798%205.22261%2C7.08897%208.64558%2C11.02708%207.55895%2C8.69654%2012.31425%2C17.63041%2013.91857%2C26.14913%200.69293%2C3.67929%200.50427%2C10.57736%20-0.37643%2C13.76393%20-0.71961%2C2.60372%20-2.83624%2C7.16673%20-4.45721%2C9.60883%20-1.80597%2C2.7208%20-5.32292%2C6.74148%20-7.67556%2C8.77492%20l%20-2.05197%2C1.77356%20z%20m%20-21.4195%2C-61.384507%20c%201.51504%2C-1.009111%202.28253%2C-2.613759%202.95472%2C-6.177698%200.94026%2C-4.985267%200.30509%2C-6.56663%20-3.54098%2C-8.815896%20-2.72699%2C-1.594804%20-4.68497%2C-3.408173%20-5.64575%2C-5.228769%20-0.38151%2C-0.722931%20-0.70054%2C-1.098702%20-0.70895%2C-0.835049%20-0.0514%2C1.610887%202.02683%2C9.826688%203.49826%2C13.82961%201.05039%2C2.857518%201.75881%2C5.372734%201.79324%2C6.366879%200.0313%2C0.903836%200.15068%2C1.643509%200.26527%2C1.643717%200.1146%2C2.07e-4%200.73748%2C-0.35205%201.38419%2C-0.782794%20z%20m%2058.95834%2C-17.705001%20c%203.14035%2C-1.312122%2010.26866%2C-6.989767%2012.64841%2C-10.074364%200.80922%2C-1.048902%201.38259%2C-1.99581%201.27416%2C-2.104243%20-1.23912%2C-1.23912%20-12.67671%2C7.151182%20-15.10543%2C11.080922%20-1.10106%2C1.781558%20-0.90013%2C1.968018%201.18286%2C1.097685%20z%20M%20110.15392%2C58.222196%20c%20-0.16977%2C-2.039799%200.20514%2C-5.89763%200.80711%2C-8.305098%200.1627%2C-0.650688%200.0535%2C-0.778603%20-0.66469%2C-0.778603%20-1.05632%2C0%20-1.29193%2C0.911503%20-1.29193%2C4.998111%200%2C2.410601%200.75229%2C6.421399%201.20443%2C6.421399%200.0767%2C0%200.052%2C-1.051114%20-0.0549%2C-2.335809%20z%22%20id%3D%22path2338%22%20transform%3D%22matrix(0%2C0.8%2C0.8%2C0%2C86.0392%2C29.3104)%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%3Cpath%20style%3D%22fill%3A%234A4A48%3Bfill-opacity%3A1%3Bstroke-width%3A0.346046%22%20d%3D%22m%20176.0923%2C205.08044%20c%20-8.87165%2C-13.53967%20-31.99484%2C-48.83214%20-51.38487%2C-78.4277%20L%2089.452824%2C72.842628%2089.33912%2C68.237047%20c%20-0.174501%2C-7.068182%201.151845%2C-12.295432%204.44145%2C-17.504153%203.819704%2C-6.048075%2011.54463%2C-9.917288%2016.04542%2C-8.036735%200.73657%2C0.307757%201.37754%2C0.559559%201.42438%2C0.559559%200.0468%2C0%200.35305%2C-0.973254%200.68046%2C-2.162786%200.96841%2C-3.518295%202.80988%2C-6.982787%204.92698%2C-9.269505%203.73236%2C-4.031393%207.14283%2C-5.002057%2017.58096%2C-5.003756%207.34789%2C-0.0012%209.85002%2C0.408133%2013.77629%2C2.253701%202.22653%2C1.046594%205.93177%2C4.322253%207.99756%2C7.070335%203.67597%2C4.890095%204.97179%2C8.489855%205.3629%2C14.89804%200.31896%2C5.226016%200.6487%2C6.191181%203.33407%2C9.759023%202.45782%2C3.265505%202.8235%2C4.060386%202.20872%2C4.801149%20-0.25828%2C0.311199%20-1.29528%2C0.930974%20-2.30446%2C1.377279%20-2.0652%2C0.913333%20-2.52518%2C1.61256%20-1.6772%2C2.549568%200.54627%2C0.603622%200.52627%2C0.681434%20-0.35283%2C1.37294%20l%20-0.93193%2C0.73305%200.91387%2C0.846947%20c%201.19321%2C1.105823%201.15434%2C1.77601%20-0.14187%2C2.446304%20-0.71431%2C0.369383%20-1.00215%2C0.735981%20-0.89001%2C1.133535%200.0911%2C0.323176%200.26849%2C1.547143%200.39409%2C2.71993%200.19953%2C1.863024%200.13942%2C2.221296%20-0.47591%2C2.836627%20-0.90149%2C0.901484%20-2.5626%2C1.339882%20-6.70412%2C1.769336%20-4.16729%2C0.432124%20-6.6736%2C1.350412%20-8.28425%2C3.035264%20-1.7564%2C1.837316%20-2.06408%2C2.595478%20-2.26949%2C5.592289%20-0.1387%2C2.023617%20-0.008%2C3.334262%200.55628%2C5.564416%200.94928%2C3.753866%202.03214%2C5.400076%204.13387%2C6.284496%200.89021%2C0.3746%203.02006%2C1.36146%204.73298%2C2.19302%203.35053%2C1.62653%204.31487%2C2.51603%2013.45165%2C12.40766%202.13669%2C2.31321%207.12526%2C6.94339%2011.54526%2C10.71579%204.28059%2C3.65342%208.40948%2C7.17933%209.1753%2C7.83536%20l%201.39241%2C1.19277%200.73114%2C-0.91838%20c%201.23037%2C-1.54545%204.79707%2C-8.18613%205.98259%2C-11.13871%200.6164%2C-1.53513%201.58293%2C-4.97011%202.14785%2C-7.63327%200.56492%2C-2.66316%201.34776%2C-6.32146%201.73965%2C-8.12955%200.79725%2C-3.67842%200.90626%2C-6.4173%200.33743%2C-8.47812%20-0.42254%2C-1.5308%20-2.80908%2C-4.075595%20-5.60706%2C-5.978857%20-1.96707%2C-1.338051%20-2.84071%2C-3.039143%20-3.19809%2C-6.227065%20l%20-0.24333%2C-2.170593%20-6.90116%2C-6.733579%20c%20-3.79564%2C-3.703468%20-7.31586%2C-6.932341%20-7.82273%2C-7.175276%20-0.50686%2C-0.242931%20-0.96912%2C-0.688645%20-1.02725%2C-0.990476%20-0.18883%2C-0.980521%203.04154%2C-4.775712%206.53788%2C-7.681011%206.7943%2C-5.645756%2011.3807%2C-7.54826%2011.3807%2C-4.72088%200%2C0.609101%207.48347%2C14.345986%209.30497%2C17.080488%200.55679%2C0.835877%201.3497%2C1.505354%202.06673%2C1.745005%200.63984%2C0.213853%201.34656%2C0.639389%201.5705%2C0.945636%200.27305%2C0.373424%200.72019%2C0.496973%201.35761%2C0.375124%201.69259%2C-0.32356%202.38871%2C0.743413%204.22671%2C6.478495%201.14214%2C3.56378%201.45938%2C8.125192%200.89684%2C12.895052%20-0.21407%2C1.815157%20-0.62084%2C7.014137%20-0.90394%2C11.553277%20-0.70746%2C11.3436%20-3.12135%2C25.68712%20-5.8731%2C34.89852%20-0.68228%2C2.2839%20-1.77148%2C6.04664%20-2.42044%2C8.36165%20-0.64897%2C2.31501%20-1.42713%2C4.68711%20-1.72924%2C5.27134%20-0.70138%2C1.35633%20-2.34558%2C2.20525%20-4.19909%2C2.16804%20-1.88774%2C-0.0379%20-9.52077%2C-1.86832%20-11.7%2C-2.8057%20-0.93098%2C-0.40046%20-1.7372%2C-0.6836%20-1.7916%2C-0.6292%20-0.18869%2C0.18869%205.23212%2C7.12607%208.62549%2C11.03863%207.57275%2C8.73141%2012.31521%2C17.64407%2013.91857%2C26.15768%200.69293%2C3.67929%200.50427%2C10.57736%20-0.37643%2C13.76393%20-1.739%2C6.29208%20-6.53216%2C13.53271%20-12.22067%2C18.46076%20l%20-1.96992%2C1.70656%20z%20M%20121.0021%2C88.050951%20c%200.78244%2C-1.423293%201.84414%2C-5.906963%201.84414%2C-7.787963%200%2C-2.158115%20-0.93885%2C-3.342944%20-4.51994%2C-5.704205%20-2.54624%2C-1.678913%20-3.66836%2C-2.665344%20-4.51068%2C-3.965279%20-0.6167%2C-0.951723%20-1.18527%2C-1.730402%20-1.26351%2C-1.730402%20-0.47751%2C0%202.0456%2C10.054044%203.53179%2C14.073411%200.84208%2C2.277386%201.63844%2C4.950156%201.76968%2C5.939487%20l%200.23861%2C1.798781%201.07935%2C-0.628669%20c%200.59365%2C-0.345768%201.4174%2C-1.243591%201.83056%2C-1.995161%20z%20m%2060.21479%2C-17.563756%20c%203.58588%2C-2.27687%208.02362%2C-6.069002%209.80627%2C-8.379643%200.75805%2C-0.982576%201.37827%2C-1.888906%201.37827%2C-2.014069%200%2C-0.87548%20-3.11593%2C0.587148%20-6.82226%2C3.202391%20-4.10908%2C2.899423%20-9.09584%2C7.897853%20-9.09584%2C9.117121%200%2C0.640586%201.92538%2C-0.142737%204.73356%2C-1.9258%20z%20M%20110.13547%2C58.049173%20c%20-0.15302%2C-1.908169%200.24547%2C-5.812338%200.83308%2C-8.162045%200.17323%2C-0.692713%200.0871%2C-0.791882%20-0.60098%2C-0.692091%20-0.58618%2C0.08501%20-0.88893%2C0.44372%20-1.12053%2C1.327641%20-0.58056%2C2.215716%200.12915%2C9.689281%200.92012%2C9.689281%200.078%2C0%200.0637%2C-0.973254%20-0.0317%2C-2.162786%20z%22%20id%3D%22path2377%22%20transform%3D%22matrix(0%2C0.8%2C0.8%2C0%2C86.0392%2C29.3104)%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%3Cpath%20style%3D%22display%3Ainline%3Bfill%3A%234A4A48%3Bfill-opacity%3A1%3Bstroke-width%3A0.122346%22%20d%3D%22%22%20id%3D%22path2416%22%20transform%3D%22matrix(0%2C0.8%2C0.8%2C0%2C86.0392%2C29.3104)%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%3Cpath%20style%3D%22display%3Ainline%3Bfill%3A%234A4A48%3Bfill-opacity%3A1%3Bstroke-width%3A0.122346%22%20d%3D%22M%205.4043555%2C153.26851%20C%205.0856126%2C148.60325%204.9911392%2C144.74796%205.0513899%2C138.86462%205.1172043%2C132.438%205.2174401%2C130.89717%205.9429421%2C125.15959%208.3421294%2C106.18583%2014.371341%2C88.719571%2024.172914%2C72.348466%2031.152326%2C60.691085%2040.111436%2C49.937812%2050.651097%2C40.567727%2067.680888%2C25.427718%2088.587271%2C14.762215%20110.84515%2C9.8594088%20c%205.96947%2C-1.3149104%2012.80354%2C-2.3915351%2017.5566%2C-2.7658278%200.94207%2C-0.074185%205.12629%2C-0.1658737%209.29827%2C-0.2037524%2011.02347%2C-0.1000853%2014.73586%2C0.085828%2021.47166%2C1.0752801%2024.30704%2C3.5705703%2046.32972%2C13.1278063%2065.5161%2C28.4321723%205.50652%2C4.392379%2015.68245%2C14.455236%2020.15548%2C19.931519%201.56259%2C1.913066%203.85671%2C4.945284%205.56246%2C7.352108%209.68423%2C13.66444%2016.82647%2C29.117576%2020.83747%2C45.084372%200.2113%2C0.84112%200.52953%2C2.1074%200.70719%2C2.81395%20l%200.323%2C1.28463%200.0646%2C21.25757%200.0646%2C21.25755%20h%20-5.69234%20l%20-5.69235%2C-1e-5%200.15162%2C-1.49874%20c%200.53906%2C-5.32875%200.55282%2C-15.74248%200.0309%2C-23.3986%20-0.48624%2C-7.13299%20-2.5274%2C-17.14304%20-5.24342%2C-25.71403%20C%20252.19633%2C92.89998%20246.37821%2C81.338988%20238.9434%2C70.960474%20234.88108%2C65.289757%20232.52348%2C62.574696%20225.97774%2C56.028945%20220.3044%2C50.35561%20217.55352%2C47.888384%20213.55429%2C44.886552%20195.98235%2C31.696981%20175.52965%2C23.491354%20154.15548%2C21.055734%20c%20-4.68393%2C-0.53374%20-5.36268%2C-0.562962%20-12.96864%2C-0.558343%20-8.87851%2C0.0054%20-14.13584%2C0.255843%20-17.95483%2C0.855336%20-17.33683%2C2.721481%20-31.58918%2C7.784433%20-45.726074%2C16.243553%20-2.549763%2C1.525706%20-6.623685%2C4.238969%20-7.344192%2C4.891286%20l%20-0.600258%2C0.543448%200.970053%2C1.516061%20c%202.296235%2C3.588703%2012.167775%2C18.686047%2041.309701%2C63.178265%2017.05676%2C26.04127%2031.05345%2C47.41658%2031.10376%2C47.5007%200.0729%2C0.12184%20-1.88087%2C0.1519%20-9.61164%2C0.1479%20l%20-9.70312%2C-0.005%20-5.01167%2C-7.67216%20C%20113.17472%2C139.36296%2088.38183%2C101.47337%2077.813161%2C85.336087%2060.232881%2C58.49279%2057.193981%2C53.88272%2057.00079%2C53.763321%2056.795757%2C53.636604%2056.022883%2C54.25292%2054.23845%2C55.966109%2052.356988%2C57.772453%2049.402064%2C60.92364%2047.405687%2C63.252698%2034.12072%2C78.751502%2024.900603%2C97.728434%2020.866105%2C117.87671%20c%20-2.134034%2C10.65737%20-2.778893%2C22.78161%20-1.839682%2C34.58856%200.100014%2C1.2573%200.181843%2C2.42723%200.181843%2C2.59985%20v%200.31385%20H%2012.378407%205.548548%20Z%22%20id%3D%22path2455%22%20transform%3D%22matrix(0%2C0.8%2C0.8%2C0%2C86.0392%2C29.3104)%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%3Cpath%20style%3D%22display%3Ainline%3Bfill%3A%234A4A48%3Bfill-opacity%3A1%3Bstroke-width%3A0.122346%22%20d%3D%22M%205.452663%2C154.06375%20C%205.4062587%2C153.34038%205.3151851%2C152.00529%205.2502771%2C151.09687%205.0518463%2C148.31975%204.9661497%2C136.15722%205.1270051%2C133.60144%205.8897594%2C121.48228%208.4947773%2C108.5274%2012.427229%2C97.297083%2016.964671%2C84.339035%2023.839257%2C71.500229%2032.032139%2C60.68344%2042.574214%2C46.765091%2055.829893%2C34.784693%2070.348746%2C26.053137%2077.423464%2C21.798441%2085.120336%2C18.069454%2092.676826%2C15.23561%20102.6911%2C11.480045%20113.02413%2C8.9625817%20124.30318%2C7.5303972%20c%204.40433%2C-0.5592511%205.83632%2C-0.6148922%2015.84376%2C-0.6156198%2010.22119%2C-7.427e-4%2011.54612%2C0.054151%2016.33314%2C0.6767191%2019.98959%2C2.5997105%2037.77033%2C8.8447045%2054.51551%2C19.1470645%205.76262%2C3.545413%2012.49732%2C8.454205%2016.68966%2C12.16477%205.02061%2C4.443656%2012.50449%2C11.955246%2016.09263%2C16.152209%204.97064%2C5.814032%2010.92849%2C14.540761%2014.95132%2C21.899871%205.65186%2C10.339096%209.59896%2C20.420443%2012.66995%2C32.360419%20l%200.88108%2C3.42568%200.0612%2C21.31874%200.0612%2C21.31874%20-5.69548%2C-10e-6%20-5.6955%2C-1e-5%200.1532%2C-1.49874%20c%200.65433%2C-6.40169%200.51731%2C-19.7859%20-0.27399%2C-26.7631%20-0.24873%2C-2.19305%20-0.91914%2C-6.17349%20-1.59117%2C-9.44733%20-2.83417%2C-13.80681%20-7.68547%2C-26.330953%20-14.81497%2C-38.246422%20-3.67796%2C-6.146977%20-8.26629%2C-12.484928%20-12.19382%2C-16.843581%20-3.4801%2C-3.862105%20-10.18715%2C-10.517831%20-13.78153%2C-13.676062%20-2.95713%2C-2.598306%20-6.31776%2C-5.128364%20-10.76641%2C-8.105543%20-16.95731%2C-11.34833%20-36.32636%2C-18.208321%20-56.64604%2C-20.062487%20-6.31345%2C-0.5761%20-21.48277%2C-0.266272%20-27.36095%2C0.558838%20-14.25703%2C2.001235%20-28.997728%2C6.802089%20-41.107679%2C13.388239%20-5.988199%2C3.256757%20-12.982376%2C7.795365%20-12.939831%2C8.396817%200.01948%2C0.275409%202.176827%2C3.589916%2027.86224%2C42.807044%2030.39216%2C46.403517%2031.94209%2C48.770167%2038.74006%2C59.154117%203.61229%2C5.51779%206.60785%2C10.10116%206.65679%2C10.18528%200.0709%2C0.12182%20-1.88514%2C0.15239%20-9.61411%2C0.15029%20l%20-9.70312%2C-0.003%20-3.13382%2C-4.79943%20C%20118.77284%2C147.93458%20108.85907%2C132.78173%2098.465846%2C116.90126%2060.294559%2C58.576951%2057.094036%2C53.709738%2056.913133%2C53.709738%20c%20-0.543497%2C0%20-5.476908%2C4.923809%20-9.009945%2C8.992405%20-16.295136%2C18.765254%20-26.532294%2C42.657027%20-28.753862%2C67.106587%20-0.626763%2C6.89787%20-0.698971%2C15.56792%20-0.182393%2C21.89987%200.06313%2C0.77384%200.151385%2C1.91624%200.196118%2C2.53867%20l%200.08133%2C1.1317%20H%2012.390708%205.5370343%20Z%22%20id%3D%22path2494%22%20transform%3D%22matrix(0%2C0.8%2C0.8%2C0%2C86.0392%2C29.3104)%22%3E%3C%2Fpath%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E",
  "trimanSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABkAAAAYlCAYAAAB5NRBOAAAWfmNhQlgAABZ+anVtYgAAAB5qdW1kYzJwYQARABCAAACqADibcQNjMnBhAAAAFlhqdW1iAAAAR2p1bWRjMm1hABEAEIAAAKoAOJtxA3VybjpjMnBhOjdjZDM4NzZhLTYzZTctNDVkNi04ZmJjLWNhMWM4ZDVkNWJkNQAAAAOTanVtYgAAAClqdW1kYzJhcwARABCAAACqADibcQNjMnBhLmFzc2VydGlvbnMAAAAAuGp1bWIAAABEanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5pbmdyZWRpZW50LnYzAAAAABhjMnNohIsmfiVhE/WsZYTds4f6xQAAAGxjYm9yo2lkYzpmb3JtYXRpaW1hZ2UvcG5namluc3RhbmNlSUR4LHhtcDppaWQ6NDA2ZGE3NzItYTRkMS00YzA1LWFhMGEtZWNlZjRlNTg4YjQybHJlbGF0aW9uc2hpcGhwYXJlbnRPZgAAAeJqdW1iAAAAQWp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuYWN0aW9ucy52MgAAAAAYYzJzaP4S6lVEgOUg7NqQAmIITPoAAAGZY2JvcqJnYWN0aW9uc4KiZmFjdGlvbmtjMnBhLm9wZW5lZGpwYXJhbWV0ZXJzoWtpbmdyZWRpZW50c4GiY3VybHgtc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5pbmdyZWRpZW50LnYzZGhhc2hYIHBKDpIGXxL7KehGOTf9Dm+R+vho65HQNW+zfpdO3kvrpGZhY3Rpb254HWNvbS5hbnRocm9waWMuY2xhdWRlLnByb3ZpZGVkanBhcmFtZXRlcnOheB9jb20uYW50aHJvcGljLm9yaWdpbi1jb25maWRlbmNlZ3Vua25vd25rZGVzY3JpcHRpb254ZkNsYXVkZSBwcm92aWRlZCB0aGlzIGZpbGUgYXQgdGhlIHJlcXVlc3Qgb2YgYSB1c2VyIGFuZCBtYXkgaGF2ZSBjcmVhdGVkIG9yIG1vZGlmaWVkIHRoZSBmaWxlIGNvbnRlbnRzLm1zb2Z0d2FyZUFnZW50oWRuYW1lZkNsYXVkZXJhbGxBY3Rpb25zSW5jbHVkZWT1AAAAyGp1bWIAAABAanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5oYXNoLmRhdGEAAAAAGGMyc2izmOBvPF0e3e4nqUvAYSBqAAAAgGNib3KlY2FsZ2ZzaGEyNTZjcGFkTQAAAAAAAAAAAAAAAABkaGFzaFggW1eCpj+FPRCsA/pJjV/I6x7odqU+2w9yEV4sff4yVqtkbmFtZW5qdW1iZiBtYW5pZmVzdGpleGNsdXNpb25zgaJlc3RhcnQYIWZsZW5ndGgZFooAAAI+anVtYgAAACdqdW1kYzJjbAARABCAAACqADibcQNjMnBhLmNsYWltLnYyAAAAAg9jYm9ypWNhbGdmc2hhMjU2aXNpZ25hdHVyZXhNc2VsZiNqdW1iZj0vYzJwYS91cm46YzJwYTo3Y2QzODc2YS02M2U3LTQ1ZDYtOGZiYy1jYTFjOGQ1ZDViZDUvYzJwYS5zaWduYXR1cmVqaW5zdGFuY2VJRHgseG1wOmlpZDpjNTE4MWQ3Ny0yZGJiLTRiZjYtYWVhMi1mNTBkNzVkMTUwMThyY3JlYXRlZF9hc3NlcnRpb25zg6JjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFggcEoOkgZfEvsp6EY5N/0Ob5H6+GjrkdA1b7N+l07eS+uiY3VybHgqc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5hY3Rpb25zLnYyZGhhc2hYINKH0tPzOdaJ+9vwogHvs9QN2OlHMDPA6ScQRPeMADtbomN1cmx4KXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaGFzaC5kYXRhZGhhc2hYIK1e6uCSD4CBNdCTq9B0T9E3f1oB25+C1qRTrdsgS5l4dGNsYWltX2dlbmVyYXRvcl9pbmZvo2RuYW1lb0FudGhyb3BpYyBGaWxlc2d2ZXJzaW9uZTEuMC4wa3NwZWNWZXJzaW9uZTIuNC4wAAAQOGp1bWIAAAAoanVtZGMyY3MAEQAQgAAAqgA4m3EDYzJwYS5zaWduYXR1cmUAAAAQCGNib3LShFkCEqIBJhghWQIKMIICBjCCAY2gAwIBAgIUQOWgCu7COdC+uIP6BkIFPWdVEwAwCgYIKoZIzj0EAwMwSTEXMBUGA1UEChMOQW50aHJvcGljLCBQQkMxLjAsBgNVBAMTJUFudGhyb3BpYyBDb250ZW50IENyZWRlbnRpYWxzIFJvb3QgQ0EwHhcNMjYwODA3MTg0MzU2WhcNMjgwODA2MTk0MzU2WjBEMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEpMCcGA1UEAxMgQW50aHJvcGljIENsYXVkZSBDb250ZW50IFNpZ25pbmcwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASYegpry1AYBRTVNL1CpTlbROnY3dey+UrsF9C3phYrATN3ZHf93Mo8RQN0KOUuOn19P4oWNFWe5n2/She9N7eTo1gwVjAOBgNVHQ8BAf8EBAMCB4AwFQYDVR0lBA4wDAYKKwYBBAGD6F4CATAMBgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFM5R4gSBTmRbI/jjxM+aPpzB11zCMAoGCCqGSM49BAMDA2cAMGQCMDFzHRSeAXrSy1WOzkbhPZ6Km2wGTmZ/2gK18k8BQGXyqz88Rdrz6CTX9flAnYNVxgIwcF9c3fVhqmJKpi+UhasNUMko69cyX6STPfta3Q8EjyzDjzoyrol46FP6VFHhvUcJoWNwYWRZDZ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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