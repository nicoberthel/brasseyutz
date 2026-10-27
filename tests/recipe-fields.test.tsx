// @vitest-environment jsdom
import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { RadarFields, Rows } from '@/app/admin/biere/[id]/recipe-fields';
import { RADAR_AXES } from '@/lib/recipe';

type Row = { nom: string; kg: string };

function Harness({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  return (
    <Rows<Row> rows={rows} onChange={setRows} label="un grain" blank={() => ({ nom: '', kg: '' })}
      columns={[{ key: 'nom', label: 'Nom du grain' }, { key: 'kg', label: 'kg', type: 'number' }]} />
  );
}
const val = (label: string) => (screen.getByLabelText(label) as HTMLInputElement).value;
const count = (prefix: string) => document.querySelectorAll(`input[aria-label^="${prefix}"]`).length;

describe('Rows', () => {
  it('Ajouter crée une ligne blanche, Supprimer la retire, Descendre échange l’ordre', () => {
    render(<Harness initial={[{ nom: 'Pale Ale', kg: '3,6' }, { nom: 'Pilsen', kg: '0,6' }]} />);
    expect(count('Nom du grain')).toBe(2);

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter un grain' }));
    expect(count('Nom du grain')).toBe(3);
    expect(val('Nom du grain 3')).toBe('');
    expect(val('kg 3')).toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer la ligne 3' }));
    expect(count('Nom du grain')).toBe(2);

    fireEvent.click(screen.getByRole('button', { name: 'Descendre la ligne 1' }));
    expect(val('Nom du grain 1')).toBe('Pilsen');
    expect(val('Nom du grain 2')).toBe('Pale Ale');
    expect(val('kg 2')).toBe('3,6');

    fireEvent.click(screen.getByRole('button', { name: 'Monter la ligne 2' }));
    expect(val('Nom du grain 1')).toBe('Pale Ale');

    fireEvent.change(screen.getByLabelText('kg 1'), { target: { value: '4,1' } });
    expect(val('kg 1')).toBe('4,1');
    expect(screen.getByLabelText('kg 1').getAttribute('inputmode')).toBe('decimal');
  });
});

describe('RadarFields', () => {
  it('cocher « Pas de radar » envoie null, décocher envoie [0×8]', () => {
    const onChange = vi.fn();
    const { rerender } = render(<RadarFields value={[1, 2, 3, 4, 5, 0, 1.5, 2.5]} onChange={onChange} />);
    const box = screen.getByLabelText('Pas de radar') as HTMLInputElement;
    expect(box.checked).toBe(false);
    expect(document.querySelectorAll('input[type="range"]')).toHaveLength(8);
    expect((screen.getByLabelText(RADAR_AXES[6]) as HTMLInputElement).value).toBe('1.5');
    expect(screen.getByText('1,5')).toBeTruthy();
    fireEvent.click(box);
    expect(onChange).toHaveBeenLastCalledWith(null);

    rerender(<RadarFields value={null} onChange={onChange} />);
    expect((screen.getByLabelText('Pas de radar') as HTMLInputElement).checked).toBe(true);
    expect(document.querySelectorAll('input[type="range"]')).toHaveLength(0);
    fireEvent.click(screen.getByLabelText('Pas de radar'));
    expect(onChange).toHaveBeenLastCalledWith([0, 0, 0, 0, 0, 0, 0, 0]);
  });
  it('déplacer un curseur met à jour l’axe', () => {
    const onChange = vi.fn();
    render(<RadarFields value={[0, 0, 0, 0, 0, 0, 0, 0]} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Corps'), { target: { value: '3.5' } });
    expect(onChange).toHaveBeenLastCalledWith([0, 0, 3.5, 0, 0, 0, 0, 0]);
  });
});
