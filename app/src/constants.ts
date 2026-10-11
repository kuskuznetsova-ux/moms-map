import type { AgeGroup, Kind } from './types';

export const KINDS: Record<Kind, { label: string; emoji: string; color: string }> = {
  playground: { label: 'Площадка', emoji: '🛝', color: '#2aa9a0' },
  toilet: { label: 'Туалет / пеленание', emoji: '🚼', color: '#3b82c4' },
  ramp: { label: 'Пандус / лифт', emoji: '♿', color: '#6b7bd6' },
  obstacle: { label: 'Препятствие', emoji: '⚠️', color: '#d64545' },
  cafe: { label: 'Кафе с детской', emoji: '🍰', color: '#e08a1e' },
  shop: { label: 'Удобный магазин', emoji: '🛍️', color: '#a3195b' },
  event: { label: 'Мероприятие', emoji: '🎈', color: '#7a3fb8' },
};

export const KIND_ORDER = Object.keys(KINDS) as Kind[];

export const AGES: { value: AgeGroup; label: string }[] = [
  { value: '0-1', label: 'до 1 года' },
  { value: '1-3', label: '1–3 года' },
  { value: '3-5', label: '3–5 лет' },
];

export const MOSCOW: [number, number] = [55.7558, 37.6173];
