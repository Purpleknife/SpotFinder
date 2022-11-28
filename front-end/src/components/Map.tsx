import { MapContainer, TileLayer } from 'react-leaflet';

import './Map.scss';

import 'leaflet/dist/leaflet.css';

import Pins from './Pins';

interface MapProps {
  id: number;
  creator: number;
  date_created: string;
  title: string;
  city: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  pins: any[];
}

const Map = (props: MapProps) => {

  const pinsForMaps = props.pins.map((pin) => {
    console.log('PIN', pin);
    return (
      <Pins
        key={pin.id}
        id={pin.id}
        latitude={pin.latitude}
        longitude={pin.longitude}
        title={pin.title}
        description={pin.description}
        image={pin.image}
      />
    )
  })

  return (
    <div className='map'>
      <MapContainer center={[props.latitude, props.longitude]} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pinsForMaps}
      </MapContainer>
      
      <div className='map_info'>
        Title: {props.title}
        <br />
        Location: {props.city}, {props.province}, {props.country}
        <br />
        Created by: {props.creator}, on {props.date_created}

      </div>
    </div>
  );
}
 
export default Map;

