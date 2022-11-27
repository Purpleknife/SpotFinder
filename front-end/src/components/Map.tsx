import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import './Map.scss';

import 'leaflet/dist/leaflet.css';
import L from "leaflet";


const Map = () => {

  const icon = L.icon({ iconUrl: "/images/marker-icon.png" });

  return (
    <div className='map'>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
 
export default Map;

