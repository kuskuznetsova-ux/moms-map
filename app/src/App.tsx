import { useMemo, useState } from 'react';
import AddPinSheet from './components/AddPinSheet';
import EventsList from './components/EventsList';
import MapView from './components/MapView';
import PinSheet from './components/PinSheet';
import ProfileTab from './components/ProfileTab';
import { KIND_ORDER, KINDS, STATUSES } from './constants';
import { useAppState } from './state';
import type { AgeGroup, Kind, Mom, Pin } from './types';

type Tab = 'map' | 'events' | 'profile';

export default function App() {
  const [state, setState] = useAppState();
  const [tab, setTab] = useState<Tab>('map');
  const [kinds, setKinds] = useState<Kind[]>([]); // пусто = все
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [showMoms, setShowMoms] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mom, setMom] = useState<Mom | null>(null);
  const [placing, setPlacing] = useState(false);
  const [draft, setDraft] = useState<{ lat: number; lng: number } | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const visiblePins = useMemo(
    () =>
      state.pins.filter(
        (p) => (kinds.length === 0 || kinds.includes(p.kind)) && (!age || p.kind === 'obstacle' || p.ages.length === 0 || p.ages.includes(age)),
      ),
    [state.pins, kinds, age],
  );
  const selected = state.pins.find((p) => p.id === selectedId) ?? null;

  const open = (p: Pin) => {
    setTab('map');
    setSelectedId(p.id);
    setMom(null);
    setFlyTo([p.lat, p.lng]);
  };

  const toggleKind = (k: Kind) => setKinds((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  return (
    <div className="app">
      {tab === 'map' && (
        <>
          <div className="filters">
            {KIND_ORDER.map((k) => (
              <button key={k} className={`chip-btn${kinds.includes(k) ? ' on' : ''}`} onClick={() => toggleKind(k)}>
                {KINDS[k].emoji} {KINDS[k].label}
              </button>
            ))}
            <button className={`chip-btn${showMoms ? ' on' : ''}`} onClick={() => setShowMoms((v) => !v)}>
              👩 Мамы рядом
            </button>
            {(['0-1', '1-3', '3-5'] as AgeGroup[]).map((a) => (
              <button key={a} className={`chip-btn${age === a ? ' on' : ''}`} onClick={() => setAge(age === a ? null : a)}>
                {a === '0-1' ? 'до 1 года' : a === '1-3' ? '1–3 года' : '3–5 лет'}
              </button>
            ))}
          </div>
          <MapView
            pins={visiblePins}
            moms={showMoms ? state.moms : []}
            me={state.me}
            placing={placing}
            flyTo={flyTo}
            onPickPin={(p) => { setSelectedId(p.id); setMom(null); }}
            onPickMom={(m) => { setMom(m); setSelectedId(null); }}
            onPlace={(lat, lng) => { setDraft({ lat, lng }); setPlacing(false); }}
          />
          {placing && <div className="banner">Нажмите на карте, где поставить метку <button onClick={() => setPlacing(false)}>Отмена</button></div>}
          {!placing && !draft && !selected && !mom && (
            <button className="fab" onClick={() => setPlacing(true)} aria-label="Добавить метку">＋</button>
          )}
          {selected && (
            <PinSheet
              pin={selected}
              onClose={() => setSelectedId(null)}
              onReview={(pinId, rating, text) =>
                setState((s) => ({
                  ...s,
                  pins: s.pins.map((p) =>
                    p.id === pinId
                      ? { ...p, reviews: [...p.reviews, { id: `rv${Date.now()}`, author: s.me.name || 'Мама', rating, text, date: new Date().toISOString() }] }
                      : p,
                  ),
                }))
              }
            />
          )}
          {mom && (
            <div className="sheet">
              <button className="close" onClick={() => setMom(null)} aria-label="Закрыть">×</button>
              <h2>{mom.name}</h2>
              <p>{STATUSES[mom.status].emoji} {STATUSES[mom.status].label}</p>
              <p className="meta">Ребёнок: {mom.childAge}{mom.interests.length > 0 && <> · Интересы: {mom.interests.join(', ')}</>}</p>
              <p className="meta">Сообщения между мамами появятся в следующей версии.</p>
            </div>
          )}
          {draft && (
            <AddPinSheet
              at={draft}
              author={state.me.name || 'Мама'}
              onCancel={() => setDraft(null)}
              onSave={(p) => {
                setState((s) => ({ ...s, pins: [...s.pins, p] }));
                setDraft(null);
                setSelectedId(p.id);
              }}
            />
          )}
        </>
      )}
      {tab === 'events' && (
        <EventsList events={state.pins.filter((p) => p.kind === 'event')} ageFilter={age} onAge={setAge} onOpen={open} />
      )}
      {tab === 'profile' && <ProfileTab me={state.me} onChange={(me) => setState((s) => ({ ...s, me }))} />}

      <nav className="tabs">
        <button className={tab === 'map' ? 'on' : ''} onClick={() => setTab('map')}>🗺️<span>Карта</span></button>
        <button className={tab === 'events' ? 'on' : ''} onClick={() => setTab('events')}>🎈<span>Мероприятия</span></button>
        <button className={tab === 'profile' ? 'on' : ''} onClick={() => setTab('profile')}>👩<span>Профиль</span></button>
      </nav>
    </div>
  );
}
