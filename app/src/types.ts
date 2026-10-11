export type Kind =
  | 'playground'
  | 'toilet'
  | 'ramp'
  | 'obstacle'
  | 'cafe'
  | 'shop'
  | 'event';

export type AgeGroup = '0-1' | '1-3' | '3-5';

export interface Review {
  id: string;
  author: string;
  rating: number; // 1..5
  text: string;
  date: string; // ISO
}

export interface Pin {
  id: string;
  kind: Kind;
  title: string;
  description: string;
  lat: number;
  lng: number;
  ages: AgeGroup[];
  reviews: Review[];
  // только для kind === 'event'
  startsAt?: string; // ISO
  price?: number; // 0 = бесплатно
  organizer?: string;
}

export type MomStatus = 'walk' | 'craft' | 'chat';

export interface Mom {
  id: string;
  name: string;
  status: MomStatus;
  interests: string[];
  childAge: string;
  lat: number;
  lng: number;
}

export interface Me {
  name: string;
  status: MomStatus;
  interests: string[];
  childAge: string;
  shareLocation: boolean;
  lat: number;
  lng: number;
}

export interface AppState {
  pins: Pin[];
  moms: Mom[];
  me: Me;
}
