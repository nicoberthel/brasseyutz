// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('mentions légales + seo', () => {
  it('page mentions légales : sections LCEN', async () => {
    const Page = (await import('@/app/mentions-legales/page')).default;
    render(<Page />);
    expect(screen.getByText('Éditeur')).toBeTruthy();
    expect(screen.getByText('Hébergeur')).toBeTruthy();
    expect(screen.getByText('Propriété intellectuelle')).toBeTruthy();
    expect(screen.getByText('Données personnelles')).toBeTruthy();
    expect(screen.getByText(/à titre non professionnel/)).toBeTruthy();
    expect(screen.getByText(/aucun traceur/i)).toBeTruthy();
    expect(screen.getByText(/à venir/)).toBeTruthy(); // hébergeur non renseigné
  });
  it('sitemap : accueil + fiches + brassins', async () => {
    const sitemap = (await import('@/app/sitemap')).default;
    const entries = await sitemap();
    const urls = entries.map(e => e.url);
    expect(urls).toContain('https://www.brasseyutz.fr');
    expect(urls).toContain('https://www.brasseyutz.fr/biere/hop-overflow');
    expect(urls).toContain('https://www.brasseyutz.fr/brassin/33');
    expect(urls).toContain('https://www.brasseyutz.fr/mentions-legales');
  });
  it('robots : /admin interdit', async () => {
    const robots = (await import('@/app/robots')).default;
    const r = robots();
    expect(JSON.stringify(r.rules)).toContain('/admin');
  });
});
