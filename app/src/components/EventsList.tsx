import { AGES } from '../constants';
import type { AgeGroup, Pin } from '../types';

interface Props {
  events: Pin[];
  ageFilter: AgeGroup | null;
  onAge: (a: AgeGroup | null) => void;
  onOpen: (p: Pin) => void;
}

export default function EventsList({ events, ageFilter, onAge, onOpen }: Props) {
  const upcoming = events
    .filter((e) => !ageFilter || e.ages.includes(ageFilter))
    .sort((a, b) => (a.startsAt ?? '').localeCompare(b.startsAt ?? ''));
  return (
    <div className="page">
      <h1>Мероприятия</h1>
      <div className="chips">
        <button className={`chip-btn${!ageFilter ? ' on' : ''}`} onClick={() => onAge(null)}>Любой возраст</button>
        {AGES.map((a) => (
          <button key={a.value} className={`chip-btn${ageFilter === a.value ? ' on' : ''}`} onClick={() => onAge(a.value)}>
            {a.label}
          </button>
        ))}
      </div>
      {upcoming.length === 0 && <p className="meta">Мероприятий пока нет. Добавьте своё через «+» на карте.</p>}
      {upcoming.map((e) => (
        <button key={e.id} className="card" onClick={() => onOpen(e)}>
          <b>{e.title}</b>
          <span className="meta">
            {e.startsAt && new Date(e.startsAt).toLocaleString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            {' · '}
            {e.price ? `${e.price} ₽` : 'бесплатно'}
          </span>
          <span>{e.description}</span>
        </button>
      ))}
    </div>
  );
}
