import { ActivityType, type Bounds } from '@/types';

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

export function formatSpeed(secondsPerKm: number | undefined, type: ActivityType | undefined) {
  if (!secondsPerKm || !type) {
    return '';
  }

  if (type == ActivityType.Ride) {
    return formatRideSpeed(secondsPerKm);
  } else {
    return formatRunSpeed(secondsPerKm);
  }
}

export function formatRunSpeed(secondsPerKm: number) {
  const minutes = Math.floor(secondsPerKm);
  const seconds = Math.round(60 * (secondsPerKm - minutes));

  return `${minutes}:${seconds.toString().padStart(2, '0')} / km`;
}

export function formatRideSpeed(secondsPerKm: number) {
  const kmPerHour = 60 / secondsPerKm;

  return `${kmPerHour.toFixed(1)} km/h`;
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
