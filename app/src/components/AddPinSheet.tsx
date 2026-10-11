import { useState } from 'react';
import { AGES, KIND_ORDER, KINDS } from '../constants';
import { Icon } from '../icons';
import type { AgeGroup, Kind, NewPin } from '../types';

interface Props {
  at: { lat: number; lng: number };
  author: string;
  onSave: (p: NewPin) => void;
  onCancel: () => void;
}

export default function AddPinSheet({ at, author, onSave, onCancel }: Props) {
  const [kind, setKind] = useState<Kind>('playground');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ages, setAges] = useState<AgeGroup[]>([]);
  const [startsAt, setStartsAt] = useState('');
  const [price, setPrice] = useState('0');

  const isEvent = kind === 'event';
  const valid = title.trim().length > 0 && (!isEvent || startsAt);

  const toggleAge = (a: AgeGroup) => setAges((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  return (
    <div className="sheet" role="dialog" aria-label="Новая метка">
      <button className="close" onClick={onCancel} aria-label="Закрыть">×</button>
      <h2>Новая метка</h2>
      <div className="chips">
        {KIND_ORDER.map((k) => (
          <button
            key={k}
            type="button"
            className={`chip-btn${kind === k ? ' on' : ''}`}
            onClick={() => setKind(k)}
          >
            <Icon name={KINDS[k].icon} size={16} /> {KINDS[k].label}
          </button>
        ))}
      </div>
      <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea
        placeholder={isEvent ? 'О чём мероприятие?' : 'Что здесь удобно или неудобно?'}
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {isEvent && (
        <div className="row">
          <label>
            Когда
            <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          </label>
          <label>
            Цена, ₽
            <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
        </div>
      )}
      {kind !== 'obstacle' && (
        <div className="chips">
          {AGES.map((a) => (
            <button
              key={a.value}
              type="button"
              className={`chip-btn${ages.includes(a.value) ? ' on' : ''}`}
              onClick={() => toggleAge(a.value)}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
      <button
        className="primary"
        disabled={!valid}
        onClick={() =>
          onSave({
            kind,
            title: title.trim(),
            description: description.trim(),
            lat: at.lat,
            lng: at.lng,
            ages,
            author,
            ...(isEvent ? { startsAt: new Date(startsAt).toISOString(), price: Number(price) || 0, organizer: author } : {}),
          })
        }
      >
        Добавить на карту
      </button>
    </div>
  );
}
