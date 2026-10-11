import { useState } from 'react';

export default function Welcome({ onDone }: { onDone: (name: string) => void }) {
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const ok = name.trim().length > 0 && agree;
  return (
    <div className="page welcome">
      <h1>Mom's Map</h1>
      <p>Карта мест, удобных для прогулок с детьми и коляской. Это тестовая версия.</p>
      <label>
        Как вас называть? (имя или псевдоним)
        <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="например, Аня" />
      </label>
      <div className="notice">
        <b>Что мы храним</b>
        <ul>
          <li>Имя или псевдоним, которое вы ввели.</li>
          <li>Метки, мероприятия и отзывы, которые вы добавили, с координатами места.</li>
        </ul>
        <b>Чего мы не делаем</b>
        <ul>
          <li>Не просим email и телефон.</li>
          <li>Не сохраняем и не показываем другим ваше местоположение.</li>
          <li>Не собираем имена, фото и возраст детей.</li>
        </ul>
        Не ставьте метки у своего дома и не пишите личные данные в описаниях и отзывах. Свои данные можно удалить в профиле.
      </div>
      <label className="switch">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        Я согласна, что это тестовая версия и мои метки и отзывы увидят другие участницы теста
      </label>
      <button className="primary" disabled={!ok} onClick={() => onDone(name.trim())}>Начать</button>
    </div>
  );
}
