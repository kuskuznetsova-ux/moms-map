import { useState } from 'react';
import { AGES, KINDS } from '../constants';
import type { Pin } from '../types';

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

const avg = (p: Pin) => (p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0);

interface Props {
  pin: Pin;
  onClose: () => void;
  onReview: (pinId: string, rating: number, text: string) => void;
}

export default function PinSheet({ pin, onClose, onReview }: Props) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const kind = KINDS[pin.kind];
  const rating_ = avg(pin);

  return (
    <div className="sheet" role="dialog" aria-label={pin.title}>
      <button className="close" onClick={onClose} aria-label="Закрыть">×</button>
      <div className="chip" style={{ background: kind.color }}>{kind.emoji} {kind.label}</div>
      <h2>{pin.title}</h2>
      {pin.kind === 'event' && pin.startsAt && (
        <p className="meta">
          🗓 {fmt(pin.startsAt)} · {pin.price ? `${pin.price} ₽` : 'бесплатно'}
          {pin.organizer && <> · {pin.organizer}</>}
        </p>
      )}
      {pin.ages.length > 0 && (
        <p className="meta">👶 {pin.ages.map((a) => AGES.find((x) => x.value === a)?.label).join(', ')}</p>
      )}
      <p>{pin.description}</p>

      {pin.kind !== 'event' && (
        <>
          <h3>
            Отзывы {pin.reviews.length > 0 && <span className="meta">★ {rating_.toFixed(1)} ({pin.reviews.length})</span>}
          </h3>
          {pin.reviews.length === 0 && <p className="meta">Пока нет отзывов — станьте первой.</p>}
          {pin.reviews.map((r) => (
            <div key={r.id} className="review">
              <b>{r.author}</b> <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <div>{r.text}</div>
            </div>
          ))}
          <form
            className="review-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              onReview(pin.id, rating, text.trim());
              setText('');
            }}
          >
            <div className="stars pick">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} из 5`}>
                  {n <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Чем удобно или неудобно это место с детьми?"
              rows={2}
            />
            <button className="primary" type="submit">Оставить отзыв</button>
          </form>
        </>
      )}
    </div>
  );
}
