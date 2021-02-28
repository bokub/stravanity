import { Bounds } from '@/types';

export function formatDistance(d: number | undefined) {
  if (d === 0) {
    return '0 m';
  }
  if (!d) {
    return '';
  }
  d = Math.round(d);
  if (d <= 999) {
    return `${d} m`;
  }
  return `${Math.round(d / 10) / 100} km`;
}

export function formatSpeed(s: number | undefined) {
  if (!s) {
    return '';
  }
  const minutes = Math.floor(s);
  const seconds = Math.round(60 * (s - minutes));
  return `${minutes}:${seconds.toString().padStart(2, '0')} / km`;
}

export function parseTime(t: string): number {
  if (!t) {
    return 0;
  }
  if (t.slice(-1) === 's') {
    return parseFloat(t);
  }
  if (t.split(':').length === 2) {
    return Number(t.split(':')[1]) + 60 * Number(t.split(':')[0]);
  }
  return 0;
}

export function isInBounds(p: [number, number], bounds: Bounds): boolean {
  return p[0] >= bounds[0] && p[0] <= bounds[2] && p[1] >= bounds[1] && p[1] <= bounds[3];
}
