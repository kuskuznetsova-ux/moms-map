import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { NewPin, NewReview, Pin, Review } from './types';

/**
 * Слой данных. Если заданы VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY — метки лежат
 * в общей базе (Supabase), иначе только в браузере (localStorage). Интерфейс одинаковый,
 * поэтому Supabase можно заменить на другой сервер, не трогая экраны.
 */
export interface Api {
  mode: 'local' | 'cloud';
  load(): Promise<Pin[]>;
  addPin(p: NewPin): Promise<Pin>;
  addReview(pinId: string, r: NewReview): Promise<Review>;
  deleteMine(): Promise<void>;
  report(pinId: string, reviewId: string | null, reason: string): Promise<void>;
}

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `id${Date.now()}${Math.random()}`);

// ---------- локальный режим ----------
const LOCAL_KEY = 'moms-map:pins:v2';

function readLocal(): Pin[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') as Pin[];
  } catch {
    return [];
  }
}
function writeLocal(pins: Pin[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(pins));
  } catch {
    /* localStorage недоступен — данные не сохранятся после перезагрузки */
  }
}

const localApi: Api = {
  mode: 'local',
  async load() {
    return readLocal();
  },
  async addPin(p) {
    const pin: Pin = { ...p, id: newId(), reviews: [] };
    writeLocal([...readLocal(), pin]);
    return pin;
  },
  async addReview(pinId, r) {
    const review: Review = { ...r, id: newId(), date: new Date().toISOString() };
    writeLocal(readLocal().map((p) => (p.id === pinId ? { ...p, reviews: [...p.reviews, review] } : p)));
    return review;
  },
  async deleteMine() {
    writeLocal([]);
  },
  async report() {
    /* в локальном режиме некому модерировать */
  },
};

// ---------- облачный режим (Supabase) ----------
interface ReviewRow {
  id: string;
  rating: number;
  text: string;
  author_name: string;
  created_at: string;
}
interface PinRow {
  id: string;
  kind: Pin['kind'];
  title: string;
  description: string;
  lat: number;
  lng: number;
  ages: Pin['ages'];
  starts_at: string | null;
  price: number | null;
  organizer: string | null;
  author_name: string;
  tags?: string[] | null;
  stroller?: Pin['stroller'] | null;
  reviews: ReviewRow[];
}

const toReview = (r: ReviewRow): Review => ({ id: r.id, author: r.author_name, rating: r.rating, text: r.text, date: r.created_at });
const toPin = (r: PinRow): Pin => ({
  id: r.id,
  kind: r.kind,
  title: r.title,
  description: r.description,
  lat: r.lat,
  lng: r.lng,
  ages: r.ages ?? [],
  author: r.author_name,
  ...(r.tags && r.tags.length ? { tags: r.tags } : {}),
  ...(r.stroller ? { stroller: r.stroller } : {}),
  reviews: (r.reviews ?? []).map(toReview).sort((a, b) => a.date.localeCompare(b.date)),
  ...(r.starts_at ? { startsAt: r.starts_at } : {}),
  ...(r.price !== null ? { price: r.price } : {}),
  ...(r.organizer ? { organizer: r.organizer } : {}),
});

function cloudApi(db: SupabaseClient): Api {
  // Анонимный вход: пользователь не вводит email/телефон, Supabase выдаёт случайный id.
  let ready: Promise<void> | null = null;
  const ensureSession = () =>
    (ready ??= (async () => {
      const { data } = await db.auth.getSession();
      if (data.session) return;
      const { error } = await db.auth.signInAnonymously();
      if (error) {
        ready = null;
        throw error;
      }
    })());

  return {
    mode: 'cloud',
    async load() {
      await ensureSession();
      const { data, error } = await db.from('pins').select('*, reviews(*)').order('created_at');
      if (error) throw error;
      return (data as PinRow[]).map(toPin);
    },
    async addPin(p) {
      await ensureSession();
      const { data, error } = await db
        .from('pins')
        .insert({
          kind: p.kind,
          title: p.title,
          description: p.description,
          lat: p.lat,
          lng: p.lng,
          ages: p.ages,
          starts_at: p.startsAt ?? null,
          price: p.price ?? null,
          organizer: p.organizer ?? null,
          author_name: p.author,
          // Колонки tags/stroller добавлены миграцией; шлём их только когда заполнены,
          // чтобы приложение не ломалось на базе без миграции.
          ...(p.tags?.length ? { tags: p.tags } : {}),
          ...(p.stroller ? { stroller: p.stroller } : {}),
        })
        .select('*, reviews(*)')
        .single();
      if (error) throw error;
      return toPin(data as PinRow);
    },
    async addReview(pinId, r) {
      await ensureSession();
      const { data, error } = await db
        .from('reviews')
        .insert({ pin_id: pinId, rating: r.rating, text: r.text, author_name: r.author })
        .select()
        .single();
      if (error) throw error;
      return toReview(data as ReviewRow);
    },
    async deleteMine() {
      await ensureSession();
      const { data } = await db.auth.getUser();
      if (!data.user) return;
      const { error } = await db.from('pins').delete().eq('author_id', data.user.id);
      if (error) throw error;
      const { error: e2 } = await db.from('reviews').delete().eq('author_id', data.user.id);
      if (e2) throw e2;
    },
    async report(pinId, reviewId, reason) {
      await ensureSession();
      const { error } = await db.from('reports').insert({ pin_id: pinId, review_id: reviewId, reason });
      if (error) throw error;
    },
  };
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const api: Api = url && key ? cloudApi(createClient(url, key)) : localApi;
