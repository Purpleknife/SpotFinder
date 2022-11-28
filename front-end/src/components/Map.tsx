import { MapContainer, TileLayer } from 'react-leaflet';

import './Map.scss';

import 'leaflet/dist/leaflet.css';

import Pins from './Pins';

import MapView from './MapView';

import { Link, useNavigate } from 'react-router-dom';

interface MapProps {
  id: number;
  creator: number;
  username: string;
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
  const navigate = useNavigate();

  const pinsForMaps = props.pins.map((pin) => {
    //console.log('PIN', pin);
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
      <MapView id={props.id} key={props.id} latitude={props.latitude} longitude={props.longitude} pins={pinsForMaps}/>
      {/* <MapContainer center={[props.latitude, props.longitude]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pinsForMaps}
      </MapContainer> */}
      
      <div className='map_info'>
        Title: {props.title}
        <br />
        Location: {props.city}, {props.province}, {props.country}
        <br />
        Created by: {props.username}, on {props.date_created}
      </div>


      <button type='submit' onClick={() => navigate(`/maps/${props.id}`, 
        { state: 
            {id: props.id, 
            key: props.id,
            latitude: props.latitude,
            longitude: props.longitude}
        })
            }>
              
              View</button>
    </div>
  );
}
 
export default Map;

