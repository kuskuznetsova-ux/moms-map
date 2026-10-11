import { useState } from 'react';
import { STATUSES } from '../constants';
import type { Me, MomStatus } from '../types';

interface Props {
  me: Me;
  onChange: (m: Me) => void;
}

export default function ProfileTab({ me, onChange }: Props) {
  const [interest, setInterest] = useState('');
  const [geoError, setGeoError] = useState('');

  const addInterest = () => {
    const v = interest.trim();
    if (v && !me.interests.includes(v)) onChange({ ...me, interests: [...me.interests, v] });
    setInterest('');
  };

  const locate = () => {
    setGeoError('');
    if (!navigator.geolocation) return setGeoError('Геолокация недоступна в этом браузере.');
    navigator.geolocation.getCurrentPosition(
      (pos) => onChange({ ...me, shareLocation: true, lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoError('Не удалось определить местоположение. Разрешите доступ в браузере.'),
    );
  };

  return (
    <div className="page">
      <h1>Мой профиль</h1>
      <label>
        Имя
        <input value={me.name} onChange={(e) => onChange({ ...me, name: e.target.value })} />
      </label>
      <label>
        Возраст ребёнка
        <input placeholder="например, 1,5 года" value={me.childAge} onChange={(e) => onChange({ ...me, childAge: e.target.value })} />
      </label>

      <h3>Чем хочу заняться</h3>
      <div className="chips">
        {(Object.keys(STATUSES) as MomStatus[]).map((s) => (
          <button key={s} className={`chip-btn${me.status === s ? ' on' : ''}`} onClick={() => onChange({ ...me, status: s })}>
            {STATUSES[s].emoji} {STATUSES[s].label}
          </button>
        ))}
      </div>

      <h3>Интересы</h3>
      <div className="chips">
        {me.interests.map((i) => (
          <button key={i} className="chip-btn on" onClick={() => onChange({ ...me, interests: me.interests.filter((x) => x !== i) })}>
            {i} ×
          </button>
        ))}
      </div>
      <div className="row">
        <input
          placeholder="Добавить интерес"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addInterest()}
        />
        <button className="primary" onClick={addInterest}>＋</button>
      </div>

      <h3>Где я</h3>
      <p className="meta">Другие мамы увидят вашу метку только если включите показ. Выключить можно в любой момент.</p>
      <label className="switch">
        <input
          type="checkbox"
          checked={me.shareLocation}
          onChange={(e) => (e.target.checked ? locate() : onChange({ ...me, shareLocation: false }))}
        />
        Показывать меня на карте
      </label>
      {geoError && <p className="error">{geoError}</p>}
    </div>
  );
}
