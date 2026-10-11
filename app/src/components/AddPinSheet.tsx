import { useState } from 'react';
import { AGES, KIND_ORDER, KINDS, OBSTACLE_TAGS, STROLLER } from '../constants';
import { Icon } from '../icons';
import type { AgeGroup, Kind, NewPin, Stroller } from '../types';

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
  const [tags, setTags] = useState<string[]>([]);
  const [stroller, setStroller] = useState<Stroller | null>(null);

  const isEvent = kind === 'event';
  const isObstacle = kind === 'obstacle';
  const hasStroller = !isEvent && !isObstacle;
  const autoTitle = isObstacle && tags.length > 0 ? OBSTACLE_TAGS.find((t) => t.value === tags[0])?.label ?? '' : '';
  const finalTitle = title.trim() || autoTitle;
  const valid = finalTitle.length > 0 && (!isEvent || startsAt);
  const toggleTag = (t: string) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

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
      {isObstacle && (
        <>
          <h3>Что именно мешает?</h3>
          <div className="chips">
            {OBSTACLE_TAGS.map((t) => (
              <button key={t.value} type="button" className={`chip-btn${tags.includes(t.value) ? ' on' : ''}`} onClick={() => toggleTag(t.value)}>
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
      {hasStroller && (
        <>
          <h3>Можно ли здесь с коляской?</h3>
          <div className="chips">
            {(Object.keys(STROLLER) as Stroller[]).map((v) => (
              <button key={v} type="button" className={`chip-btn${stroller === v ? ' on' : ''}`} onClick={() => setStroller(stroller === v ? null : v)}>
                {STROLLER[v]}
              </button>
            ))}
          </div>
        </>
      )}
      <input placeholder={autoTitle ? `Название (по умолчанию: ${autoTitle})` : 'Название'} value={title} onChange={(e) => setTitle(e.target.value)} />
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
            title: finalTitle,
            description: description.trim(),
            lat: at.lat,
            lng: at.lng,
            ages,
            author,
            ...(isObstacle && tags.length ? { tags } : {}),
            ...(hasStroller && stroller ? { stroller } : {}),
            ...(isEvent ? { startsAt: new Date(startsAt).toISOString(), price: Number(price) || 0, organizer: author } : {}),
          })
        }
      >
        Добавить на карту
      </button>
    </div>
  );
}
