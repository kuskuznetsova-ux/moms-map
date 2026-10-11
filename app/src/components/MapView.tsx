import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { KINDS, START_CENTER, START_ZOOM } from '../constants';
import { iconSvg } from '../icons';
import type { Pin } from '../types';

const pinIcon = (p: Pin) =>
  L.divIcon({
    className: 'mm-icon',
    html: `<span style="background:${KINDS[p.kind].color}">${iconSvg(KINDS[p.kind].icon, 20, 1.9)}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

const spotIcon = L.divIcon({
  className: 'mm-icon spot',
  html:
    '<span class="pulse"></span><svg width="38" height="54" viewBox="5 1 14 21" aria-hidden="true">' +
    '<path d="M12 21c-4.2-4.4-6.2-7.4-6.2-10.2a6.2 6.2 0 0112.4 0C18.2 13.6 16.2 16.6 12 21z" fill="#a3195b" stroke="#fff" stroke-width="1"/>' +
    '<circle cx="12" cy="10.8" r="2.3" fill="#fff"/></svg>',
  iconSize: [38, 54],
  iconAnchor: [19, 52],
});

function ClickCatcher({ active, onPick }: { active: boolean; onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (active) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 15));
  }, [target, map]);
  return null;
}

// Двигает карту так, чтобы метка не пряталась под формой (внизу) или панелью подтверждения.
function RevealSpot({ spot, mode }: { spot: { lat: number; lng: number } | null; mode: 'pending' | 'form' | null }) {
  const map = useMap();
  useEffect(() => {
    if (!spot || !mode) return;
    const size = map.getSize();
    const pt = map.latLngToContainerPoint([spot.lat, spot.lng]);
    const maxY = mode === 'form' ? size.y * 0.3 : size.y * 0.72;
    const targetY = mode === 'form' ? size.y * 0.18 : size.y * 0.5;
    const dx = pt.x < 40 || pt.x > size.x - 40 ? pt.x - size.x / 2 : 0;
    const dy = pt.y > maxY || pt.y < 30 ? pt.y - targetY : 0;
    if (dx || dy) map.panBy([dx, dy], { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot?.lat, spot?.lng, mode]);
  return null;
}

interface Props {
  pins: Pin[];
  placing: boolean;
  spot: { lat: number; lng: number } | null;
  spotMode: 'pending' | 'form' | null;
  onSpot: (lat: number, lng: number) => void;
  flyTo: [number, number] | null;
  onPickPin: (p: Pin) => void;
}

const OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export default function MapView({ pins, placing, spot, spotMode, onSpot, flyTo, onPickPin }: Props) {
  return (
    <MapContainer center={START_CENTER} zoom={START_ZOOM} className={`map${placing || spotMode === 'pending' ? ' placing' : ''}`} zoomControl={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url={OSM} />
      <ClickCatcher active={placing || spotMode === 'pending'} onPick={onSpot} />
      <RevealSpot spot={spot} mode={spotMode} />
      <FlyTo target={flyTo} />
      {pins.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(p)} eventHandlers={{ click: () => (placing || spotMode === 'pending' ? onSpot(p.lat, p.lng) : onPickPin(p)) }} />
      ))}
      {spot && (
        <Marker
          position={[spot.lat, spot.lng]}
          icon={spotIcon}
          draggable={spotMode === 'pending'}
          zIndexOffset={1000}
          eventHandlers={{
            dragend: (e) => {
              const ll = (e.target as L.Marker).getLatLng();
              onSpot(ll.lat, ll.lng);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
