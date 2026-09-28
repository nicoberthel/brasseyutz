export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mentions légales' };

const S = ({ t, children }: { t: string; children: React.ReactNode }) => (
  <section style={{ marginTop: 40 }}>
    <h2 style={{ margin: 0, paddingBottom: 10, borderBottom: '1px solid var(--encre)', font: '400 var(--fs-h3)/1.1 var(--font-display)', color: 'var(--encre)' }}>{t}</h2>
    <div style={{ marginTop: 14, maxWidth: 680, fontSize: 15, lineHeight: 1.6, color: 'var(--encre-2)' }}>{children}</div>
  </section>
);

export default function MentionsLegales() {
  const contact = process.env.CONTACT_EMAIL;
  const host = process.env.HOST_NAME;
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,4vw,48px) 96px' }}>
      <h1 style={{ margin: 0, font: '400 clamp(44px,6vw,72px)/0.95 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
        Mentions <i style={{ color: 'var(--accent)' }}>légales</i>
      </h1>
      <S t="Éditeur">
        <p>Site personnel édité à titre non professionnel (article 6-III-2 de la loi n° 2004-575 du 21 juin 2004, LCEN) — Brasse-Yutz, Yutz (Moselle). Directeur de la publication : l’éditeur du site.{contact ? <> Contact : {contact}.</> : null}</p>
      </S>
      <S t="Hébergeur">
        <p>{host ? `${host} — ${process.env.HOST_ADDRESS || ''} — ${process.env.HOST_PHONE || ''}` : 'Informations d’hébergement à venir.'}</p>
      </S>
      <S t="Propriété intellectuelle">
        <p>Les contenus de ce site — textes, recettes, identité visuelle, étiquettes — sont la propriété de Brasse-Yutz. Toute reproduction est soumise à accord préalable.</p>
      </S>
      <S t="Données personnelles">
        <p>Ce site ne collecte aucune donnée sur ses visiteurs : aucun traceur, aucune mesure d’audience, aucun compte visiteur. L’unique cookie est un cookie de session technique réservé à l’administration du site, exempté de consentement (délibération CNIL « cookies et autres traceurs »).</p>
      </S>
      <S t="Alcool">
        <p>L’abus d’alcool est dangereux pour la santé, à consommer avec modération. Ce site est purement informatif : les bières présentées sont brassées à titre amateur et ne sont pas destinées à la vente.</p>
      </S>
    </main>
  );
}
