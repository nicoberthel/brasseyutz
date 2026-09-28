// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from '@/app/connexion/login-form';

describe('LoginForm', () => {
  it('affiche l’erreur renvoyée par l’API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: 'Mot de passe incorrect.' }) }));
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'x' } });
    fireEvent.submit(screen.getByRole('button', { name: /Se connecter/i }).closest('form')!);
    await waitFor(() => expect(screen.getByText('Mot de passe incorrect.')).toBeTruthy());
    vi.unstubAllGlobals();
  });
});
