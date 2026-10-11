import { useState } from 'react';
import { api } from '../api';
import type { Profile } from '../profile';

interface Props {
  profile: Profile;
  onRename: (name: string) => void;
  onDeleted: () => void;
}

export default function ProfileTab({ profile, onRename, onDeleted }: Props) {
  const [name, setName] = useState(profile.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const wipe = async () => {
    if (!confirm('Удалить все ваши метки и отзывы? Это нельзя отменить.')) return;
    setBusy(true);
    setError('');
    try {
      await api.deleteMine();
      onDeleted();
    } catch {
      setError('Не удалось удалить. Попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <h1>Профиль</h1>
      <label>
        Имя или псевдоним
        <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} onBlur={() => name.trim() && onRename(name.trim())} />
      </label>
      <p className="meta">
        Режим: {api.mode === 'cloud' ? 'общая карта (метки видят все участницы теста)' : 'только на этом устройстве'}.
        Мы не храним ваш email, телефон и местоположение.
      </p>
      <h3>Мои данные</h3>
      <button className="danger" disabled={busy} onClick={wipe}>Удалить мои метки и отзывы</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
