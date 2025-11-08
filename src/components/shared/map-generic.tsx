import {useEffect, useRef} from 'react';
import {Icon, layerGroup, Marker} from 'leaflet';
import {URL_MARKER_CURRENT, URL_MARKER_DEFAULT} from '../../const';
import 'leaflet/dist/leaflet.css';
import {City, Point, Points} from './map-types.ts';
import useMap from '../hooks/use-map.tsx';

type MapGenericProps = {
  city: City;
  points: Points;
  activeId?: Point['id'];
  className?: string;
  defaultIcon?: Icon;
  activeIcon?: Icon;
  getId?: (p: Point) => Point['id'];
};

const defaultIconInstance = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const activeIconInstance = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

export default function MapGeneric(props: MapGenericProps) {
  const {
    city,
    points,
    activeId,
    className = 'map',
    defaultIcon = defaultIconInstance,
    activeIcon = activeIconInstance,
    getId = (p: Point) => p.id
  } = props;

  const mapRef = useRef<HTMLElement | null>(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (!map) return;

    const markerLayer = layerGroup().addTo(map);

    points.forEach((point) => {
      const id = getId(point);
      new Marker({
        lat: point.latitude,
        lng: point.longitude,
      })
        .setIcon(id === activeId ? activeIcon : defaultIcon)
        .addTo(markerLayer);
    });

    return () => {
      map.removeLayer(markerLayer);
    };
  }, [map, points, activeId, defaultIcon, activeIcon, getId]);

  return <section className={className} ref={mapRef as any}></section>;
}
