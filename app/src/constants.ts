import type { IconName } from './icons';
import type { AgeGroup, Kind, Stroller } from './types';

export const KINDS: Record<Kind, { label: string; icon: IconName; color: string }> = {
  playground: { label: 'Площадка', icon: 'playground', color: '#2aa9a0' },
  toilet: { label: 'Туалет / пеленание', icon: 'toilet', color: '#3b82c4' },
  ramp: { label: 'Пандус / лифт', icon: 'ramp', color: '#6b7bd6' },
  obstacle: { label: 'Препятствие', icon: 'obstacle', color: '#d64545' },
  cafe: { label: 'Кафе с детской', icon: 'cafe', color: '#e08a1e' },
  shop: { label: 'Удобный магазин', icon: 'shop', color: '#a3195b' },
  event: { label: 'Мероприятие', icon: 'balloon', color: '#7a3fb8' },
};

export const KIND_ORDER = Object.keys(KINDS) as Kind[];

export const AGES: { value: AgeGroup; label: string }[] = [
  { value: '0-1', label: 'до 1 года' },
  { value: '1-3', label: '1–3 года' },
  { value: '3-5', label: '3–5 лет' },
];

// Стартовая точка карты: пилотный район Черёмушки (центр примерный).
export const START_CENTER: [number, number] = [55.67, 37.566];
export const START_ZOOM = 15;

// Что именно мешает: выбирается в форме метки, когда тип «Препятствие».
export const OBSTACLE_TAGS: { value: string; label: string }[] = [
  { value: 'construction', label: 'Стройка / раскопки' },
  { value: 'fence', label: 'Забор / ограждение' },
  { value: 'steps', label: 'Ступеньки без пандуса' },
  { value: 'kerb', label: 'Высокий бордюр' },
  { value: 'surface', label: 'Плохое покрытие' },
  { value: 'narrow', label: 'Узкий проход' },
  { value: 'no-barrier-free', label: 'Нет безбарьерной среды' },
];

// Для мест (кафе, магазин, площадка и т. д.): можно ли с коляской.
export const STROLLER: Record<Stroller, string> = {
  yes: 'Можно с коляской',
  partial: 'Частично',
  no: 'С коляской нельзя',
};
