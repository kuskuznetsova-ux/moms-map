// Линейные иконки 24×24. stroke = currentColor, поэтому цвет задаётся через CSS.
export type IconName =
  | 'map' | 'balloon' | 'profile' | 'plus' | 'pin' | 'calendar' | 'baby'
  | 'playground' | 'toilet' | 'ramp' | 'obstacle' | 'cafe' | 'shop';

const P: Record<IconName, string> = {
  // карта с меткой
  map:
    '<path d="M3 9.6l5.5-2 7 2 5.5-2v11.2l-5.5 2-7-2-5.5 2z"/><path d="M8.5 7.6v11.2M15.5 9.6v11.2"/>' +
    '<path d="M12 9.2c-2.4-2.4-3.5-4-3.5-5.4a3.5 3.5 0 017 0c0 1.4-1.1 3-3.5 5.4z"/><circle cx="12" cy="3.8" r="1.1"/>',
  // воздушный шарик
  balloon:
    '<path d="M12 2.8c3.4 0 5.6 2.6 5.6 5.8 0 3.5-2.9 6-5.6 7.4-2.7-1.4-5.6-3.9-5.6-7.4 0-3.2 2.2-5.8 5.6-5.8z"/>' +
    '<path d="M10.9 17.2l1.1-1.2 1.1 1.2z"/><path d="M12 17.2c-1.7 1.2 1.7 2.2 0 3.8"/><path d="M9.4 7.3c.3-1.2 1-1.9 2-2.2"/>',
  // лицо женщины с хвостиком
  profile:
    '<path d="M12 6.4c-2.4 0-4 1.9-4 4.4 0 3 1.8 5.2 4 5.2s4-2.2 4-5.2c0-2.5-1.6-4.4-4-4.4z"/>' +
    '<path d="M8 10c0-3.3 1.6-5.6 4-5.6s4 2.3 4 5.6"/><path d="M8 10c2.9-.2 5-1.5 6.1-3.6"/>' +
    '<path d="M16 6.8c2.5.3 4 2.2 3.6 4.8-.2 1.5-.9 2.8-1.9 3.8"/>' +
    '<path d="M5 20.8c.8-2.7 3.5-4.2 7-4.2s6.2 1.5 7 4.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pin: '<path d="M12 21c-4.2-4.4-6.2-7.4-6.2-10.2a6.2 6.2 0 0112.4 0C18.2 13.6 16.2 16.6 12 21z"/><circle cx="12" cy="10.6" r="2.2"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
  baby:
    '<circle cx="12" cy="12.6" r="7.2"/><path d="M9.2 14.2c.8 1.5 4.8 1.5 5.6 0"/>' +
    '<path d="M9.4 11.2h.01M14.6 11.2h.01"/><path d="M12 5.4c0-1.5 1.1-2.3 2.4-2"/>',
  // горка / качели
  playground:
    '<path d="M4.5 4h15"/><path d="M9 4v10M15 4v10"/><path d="M7.4 14h3.2M13.4 14h3.2"/>' +
    '<path d="M4.5 4L3 20M19.5 4L21 20"/>',
  // пеленальная комната: малыш
  toilet:
    '<circle cx="12" cy="7" r="3"/><path d="M5.5 20.5v-2.2a6.5 6.5 0 0113 0v2.2"/><path d="M9.4 18.5h5.2"/>',
  // пандус
  ramp: '<path d="M3 18.5h18V9.2z"/><path d="M9 18.5v-1.9M13 18.5v-3.4M17 18.5v-5"/>',
  // препятствие
  obstacle: '<path d="M12 4l9 15.5H3z"/><path d="M12 10v4.2M12 16.8h.01"/>',
  cafe:
    '<path d="M5 8.5h11v5.2a4.3 4.3 0 01-4.3 4.3H9.3A4.3 4.3 0 015 13.7z"/><path d="M16 10h1.4a2.1 2.1 0 010 4.2H16"/>' +
    '<path d="M8 3.8c-.8 1 .8 1.6 0 2.7M12 3.8c-.8 1 .8 1.6 0 2.7"/>',
  shop: '<path d="M6 8h12l1.1 12H4.9z"/><path d="M9 8V6.6a3 3 0 016 0V8"/>',
};

export const iconSvg = (name: IconName, size = 24, stroke = 1.7) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;

export function Icon({ name, size = 22, stroke = 1.7 }: { name: IconName; size?: number; stroke?: number }) {
  // P — статические строки из этого файла, не пользовательский ввод.
  return <span className="icon" dangerouslySetInnerHTML={{ __html: iconSvg(name, size, stroke) }} />;
}
