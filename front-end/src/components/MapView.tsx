import { MapContainer, TileLayer } from 'react-leaflet';

import './MapView.scss';

interface MapViewProps {
  id: number;
  key: number;
  latitude: number;
  longitude: number;
  pins: any[];
}

const MapView = (props: MapViewProps) => {
  return (
    <MapContainer center={[props.latitude, props.longitude]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    {props.pins}
    </MapContainer>
  );
}
 
export default MapView;