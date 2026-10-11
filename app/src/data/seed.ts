import type { AppState, Pin, Review } from '../types';

// Демо-данные: отзывы и метки вымышленные, нужны только чтобы карта не была пустой.
const day = 24 * 3600 * 1000;
const inDays = (d: number, hour: number) => {
  const t = new Date(Date.now() + d * day);
  t.setHours(hour, 0, 0, 0);
  return t.toISOString();
};

const rv = (id: string, author: string, rating: number, text: string): Review => ({
  id,
  author,
  rating,
  text,
  date: new Date(Date.now() - 3 * day).toISOString(),
});

const pins: Pin[] = [
  {
    id: 'p1',
    kind: 'playground',
    title: 'Детская площадка в парке Дружба',
    description: 'Ограждённая площадка, мягкое покрытие, рядом лавочки в тени.',
    lat: 55.8512,
    lng: 37.4715,
    ages: ['1-3', '3-5'],
    reviews: [rv('r1', 'Анастасия', 5, 'Чисто, много места для колясок.')],
  },
  {
    id: 'p2',
    kind: 'toilet',
    title: 'Пеленальная комната у входа в парк',
    description: 'Тёплая комната с пеленальным столиком и креслом для кормления.',
    lat: 55.7318,
    lng: 37.6012,
    ages: ['0-1'],
    reviews: [rv('r2', 'Ольга', 4, 'Удобно, но иногда очередь.')],
  },
  {
    id: 'p3',
    kind: 'cafe',
    title: 'Семейное кафе с игровой',
    description: 'Детское меню, игровая комната с няней по выходным.',
    lat: 55.7603,
    lng: 37.6205,
    ages: ['1-3', '3-5'],
    reviews: [
      rv('r3', 'Мария', 5, 'Вкусно и детям есть чем заняться.'),
      rv('r4', 'Ольга', 4, 'По выходным людно, лучше бронировать.'),
    ],
  },
  {
    id: 'p4',
    kind: 'obstacle',
    title: 'Перекопан тротуар',
    description: 'Раскопки у перехода, с коляской не пройти — идти в обход по проезжей части.',
    lat: 55.7701,
    lng: 37.6086,
    ages: [],
    reviews: [],
  },
  {
    id: 'p5',
    kind: 'ramp',
    title: 'Лифт и пандус в торговом центре',
    description: 'Широкий лифт, пандус у главного входа без порогов.',
    lat: 55.7822,
    lng: 37.6334,
    ages: ['0-1', '1-3'],
    reviews: [rv('r5', 'Екатерина', 5, 'С коляской-двойней проехали без проблем.')],
  },
  {
    id: 'p6',
    kind: 'shop',
    title: 'Магазин детских товаров',
    description: 'Широкие проходы, есть пеленальный столик и пандус.',
    lat: 55.7465,
    lng: 37.5902,
    ages: ['0-1', '1-3', '3-5'],
    reviews: [],
  },
  {
    id: 'e1',
    kind: 'event',
    title: 'Чаепитие для мам и малышей',
    description: 'Знакомимся, пьём чай, дети играют. Приходите с любым возрастом.',
    lat: 55.7946,
    lng: 37.6772,
    ages: ['0-1', '1-3'],
    reviews: [],
    startsAt: inDays(2, 16),
    price: 0,
    organizer: 'Анастасия',
  },
  {
    id: 'e2',
    kind: 'event',
    title: 'Мастер-класс: лепка из глины',
    description: 'Лепим вместе с детьми, все материалы на месте.',
    lat: 55.7391,
    lng: 37.5947,
    ages: ['1-3', '3-5'],
    reviews: [],
    startsAt: inDays(4, 11),
    price: 600,
    organizer: 'Студия «Глина»',
  },
  {
    id: 'e3',
    kind: 'event',
    title: 'Гимнастика для мам с колясками',
    description: 'Лёгкая тренировка в парке, коляски берём с собой.',
    lat: 55.8548,
    lng: 37.4778,
    ages: ['0-1'],
    reviews: [],
    startsAt: inDays(1, 10),
    price: 300,
    organizer: 'Мария',
  },
];

export const seed: AppState = {
  pins,
  moms: [
    {
      id: 'm1',
      name: 'Ольга',
      status: 'walk',
      interests: ['английский', 'йога'],
      childAge: '1 год',
      lat: 55.8505,
      lng: 37.4690,
    },
    {
      id: 'm2',
      name: 'Екатерина',
      status: 'craft',
      interests: ['лепка', 'рисование'],
      childAge: '2 года',
      lat: 55.7329,
      lng: 37.6038,
    },
    {
      id: 'm3',
      name: 'Мария',
      status: 'chat',
      interests: ['книги', 'кофе'],
      childAge: '8 месяцев',
      lat: 55.7612,
      lng: 37.6221,
    },
  ],
  me: {
    name: 'Я',
    status: 'walk',
    interests: [],
    childAge: '',
    shareLocation: false,
    lat: 55.7558,
    lng: 37.6173,
  },
};
