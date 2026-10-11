export type Kind =
  | 'playground'
  | 'toilet'
  | 'ramp'
  | 'obstacle'
  | 'cafe'
  | 'shop'
  | 'event';

export type AgeGroup = '0-1' | '1-3' | '3-5';

export type Stroller = 'yes' | 'partial' | 'no';

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
  author: string;
  tags?: string[]; // для препятствий: что именно (см. OBSTACLE_TAGS)
  stroller?: Stroller; // для мест: можно ли с коляской
  // только для kind === 'event'
  startsAt?: string; // ISO
  price?: number; // 0 = бесплатно
  organizer?: string;
}

export type NewPin = Omit<Pin, 'id' | 'reviews'>;
export type NewReview = Pick<Review, 'author' | 'rating' | 'text'>;
