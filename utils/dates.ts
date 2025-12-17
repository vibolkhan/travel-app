export function todayISO(): string {
  const d = new Date();
  return toISODate(d);
}

export function addDaysISO(isoDate: string, days: number): string {
  const d = fromISODate(isoDate);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function diffNights(checkInISO: string, checkOutISO: string): number {
  const a = fromISODate(checkInISO).getTime();
  const b = fromISODate(checkOutISO).getTime();
  const ms = b - a;
  const nights = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, nights);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromISODate(isoDate: string): Date {
  // isoDate: YYYY-MM-DD
  const [y, m, d] = isoDate.split('-').map((v) => parseInt(v, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatDateShort(isoDate: string): string {
  const d = fromISODate(isoDate);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
