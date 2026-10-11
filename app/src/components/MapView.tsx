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

interface Props {
  pins: Pin[];
  placing: boolean;
  flyTo: [number, number] | null;
  onPickPin: (p: Pin) => void;
  onPlace: (lat: number, lng: number) => void;
}

const OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export default function MapView({ pins, placing, flyTo, onPickPin, onPlace }: Props) {
  return (
    <MapContainer center={START_CENTER} zoom={START_ZOOM} className={`map${placing ? ' placing' : ''}`} zoomControl={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url={OSM} />
      <ClickCatcher active={placing} onPick={onPlace} />
      <FlyTo target={flyTo} />
      {pins.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(p)} eventHandlers={{ click: () => (placing ? onPlace(p.lat, p.lng) : onPickPin(p)) }} />
      ))}
    </MapContainer>
  );
}
