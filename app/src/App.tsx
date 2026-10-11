import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import AddPinSheet from './components/AddPinSheet';
import EventsList from './components/EventsList';
import MapView from './components/MapView';
import PinSheet from './components/PinSheet';
import ProfileTab from './components/ProfileTab';
import Welcome from './components/Welcome';
import { AGES, KIND_ORDER, KINDS } from './constants';
import { Icon } from './icons';
import { useProfile } from './profile';
import type { AgeGroup, Kind, NewPin, Pin } from './types';

type Tab = 'map' | 'events' | 'profile';

export default function App() {
  const [profile, setProfile] = useProfile();
  const [pins, setPins] = useState<Pin[]>([]);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState('');
  const [tab, setTab] = useState<Tab>('map');
  const [kinds, setKinds] = useState<Kind[]>([]); // пусто = все
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [spot, setSpot] = useState<{ lat: number; lng: number } | null>(null); // выбранное на карте место
  const [formOpen, setFormOpen] = useState(false); // false = ждём подтверждения места
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const say = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 3500);
  };

  const refresh = useCallback(async () => {
    try {
      setPins(await api.load());
      setLoadError('');
    } catch {
      setLoadError('Не удалось загрузить карту. Проверьте интернет.');
    }
  }, []);

  useEffect(() => {
    if (!profile) return;
    void refresh();
    if (api.mode !== 'cloud') return;
    const t = setInterval(() => void refresh(), 30000);
    return () => clearInterval(t);
  }, [profile, refresh]);

  const visiblePins = useMemo(
    () =>
      pins.filter(
        (p) => (kinds.length === 0 || kinds.includes(p.kind)) && (!age || p.kind === 'obstacle' || p.ages.length === 0 || p.ages.includes(age)),
      ),
    [pins, kinds, age],
  );
  const selected = pins.find((p) => p.id === selectedId) ?? null;

  if (!profile) {
    return <Welcome onDone={(name) => setProfile({ name, consentAt: new Date().toISOString() })} />;
  }

  const open = (p: Pin) => {
    setTab('map');
    setSelectedId(p.id);
    setFlyTo([p.lat, p.lng]);
  };
  const toggleKind = (k: Kind) => setKinds((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  const savePin = async (p: NewPin) => {
    try {
      const created = await api.addPin(p);
      setPins((cur) => [...cur, created]);
      setSpot(null);
      setFormOpen(false);
      setSelectedId(created.id);
    } catch {
      say('Не удалось сохранить метку. Попробуйте ещё раз.');
    }
  };

  const addReview = async (pinId: string, rating: number, text: string): Promise<boolean> => {
    try {
      const r = await api.addReview(pinId, { author: profile.name, rating, text });
      setPins((cur) => cur.map((p) => (p.id === pinId ? { ...p, reviews: [...p.reviews, r] } : p)));
      return true;
    } catch {
      say('Не удалось отправить отзыв. Проверьте интернет и попробуйте ещё раз.');
      return false;
    }
  };

  const report = async (pinId: string) => {
    const reason = prompt('Что не так с этой меткой? Опишите коротко.');
    if (!reason?.trim()) return;
    try {
      await api.report(pinId, null, reason.trim().slice(0, 500));
      say('Спасибо, жалоба отправлена.');
    } catch {
      say('Не удалось отправить жалобу.');
    }
  };

  const here = () => {
    if (!navigator.geolocation) return say('Геолокация недоступна в этом браузере.');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Координаты используются только чтобы поставить метку; сами по себе не сохраняются.
        setSpot({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setFlyTo([pos.coords.latitude, pos.coords.longitude]);
        setPlacing(false);
      },
      () => say('Не удалось определить местоположение. Разрешите доступ или нажмите на карту.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="app">
      {tab === 'map' && (
        <>
          <div className="filters">
            {KIND_ORDER.map((k) => (
              <button key={k} className={`chip-btn${kinds.includes(k) ? ' on' : ''}`} onClick={() => toggleKind(k)}>
                <Icon name={KINDS[k].icon} size={16} /> {KINDS[k].label}
              </button>
            ))}
            {AGES.map((a) => (
              <button key={a.value} className={`chip-btn${age === a.value ? ' on' : ''}`} onClick={() => setAge(age === a.value ? null : a.value)}>
                {a.label}
              </button>
            ))}
          </div>
          <MapView
            pins={visiblePins}
            placing={placing}
            spot={spot}
            spotMode={spot ? (formOpen ? 'form' : 'pending') : null}
            onSpot={(lat, lng) => {
              setSpot({ lat, lng });
              setPlacing(false);
            }}
            flyTo={flyTo}
            onPickPin={(p) => setSelectedId(p.id)}
          />
          {loadError && <div className="banner error-banner">{loadError} <button onClick={() => void refresh()}>Повторить</button></div>}
          {placing && (
            <div className="banner">
              Нажмите на карте, где поставить метку
              <span className="banner-actions">
                <button onClick={here}><Icon name="pin" size={15} /> Я здесь</button>
                <button onClick={() => setPlacing(false)}>Отмена</button>
              </span>
            </div>
          )}
          {!placing && !spot && !selected && (
            <button className="fab" onClick={() => setPlacing(true)} aria-label="Добавить метку"><Icon name="plus" size={28} stroke={2.2} /></button>
          )}
          {!placing && !spot && !selected && pins.length === 0 && !loadError && (
            <div className="empty">Карта пока пуста. Нажмите «+» и добавьте первое место.</div>
          )}
          {selected && <PinSheet pin={selected} onClose={() => setSelectedId(null)} onReview={addReview} onReport={report} />}
          {spot && !formOpen && (
            <div className="confirm" role="dialog" aria-label="Подтвердите место">
              <b>Метка здесь?</b>
              <span className="meta">Перетащите метку или нажмите в другое место на карте, чтобы поправить.</span>
              <div className="row">
                <button className="primary" onClick={() => setFormOpen(true)}>Да, добавить информацию</button>
                <button className="ghost" onClick={() => setSpot(null)}>Отмена</button>
              </div>
            </div>
          )}
          {spot && formOpen && (
            <AddPinSheet
              at={spot}
              author={profile.name}
              onCancel={() => {
                setSpot(null);
                setFormOpen(false);
              }}
              onSave={savePin}
            />
          )}
        </>
      )}
      {tab === 'events' && <EventsList events={pins.filter((p) => p.kind === 'event')} ageFilter={age} onAge={setAge} onOpen={open} />}
      {tab === 'profile' && (
        <ProfileTab
          profile={profile}
          onRename={(name) => setProfile({ ...profile, name })}
          onDeleted={() => {
            void refresh();
            say('Ваши метки и отзывы удалены.');
          }}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
      <nav className="tabs">
        <button className={tab === 'map' ? 'on' : ''} onClick={() => setTab('map')}><Icon name="map" size={26} /><span>Карта</span></button>
        <button className={tab === 'events' ? 'on' : ''} onClick={() => setTab('events')}><Icon name="balloon" size={26} /><span>Мероприятия</span></button>
        <button className={tab === 'profile' ? 'on' : ''} onClick={() => setTab('profile')}><Icon name="profile" size={26} /><span>Профиль</span></button>
      </nav>
    </div>
  );
}
