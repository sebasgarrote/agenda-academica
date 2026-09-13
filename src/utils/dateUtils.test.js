import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMonthGrid, getUrgencyInfo, toISODateString } from './dateUtils';

afterEach(() => vi.useRealTimers());

describe('dateUtils', () => {
  it('genera fechas ISO sin desfase horario', () => {
    expect(toISODateString(new Date(2026, 8, 13))).toBe('2026-09-13');
  });

  it('clasifica actividades vencidas, actuales y completadas', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 13, 12));
    expect(getUrgencyInfo({ due_date: '2026-09-12', status: 'Pendiente' }).badgeText).toBe('Vencida hace 1 día');
    expect(getUrgencyInfo({ due_date: '2026-09-13', status: 'Pendiente' }).badgeText).toBe('Vence hoy');
    expect(getUrgencyInfo({ due_date: '2026-09-13', status: 'Finalizada' }).badgeText).toBe('Finalizada');
  });

  it('arma una grilla mensual completa de seis semanas', () => {
    const grid = getMonthGrid(2026, 8);
    expect(grid).toHaveLength(42);
    expect(grid.filter((day) => day.isCurrentMonth)).toHaveLength(30);
  });
});
