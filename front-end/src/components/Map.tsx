import './Map.scss';

import 'leaflet/dist/leaflet.css';

import MapView from './MapView';

import { useNavigate } from 'react-router-dom';

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

  return (
    <div className='map'>
      <MapView id={props.id} key={props.id} latitude={props.latitude} longitude={props.longitude} allPins={props.pins}/>
      
      <div className='map_info'>
        Title: {props.title}
        <br />
        Location: {props.city}, {props.province}, {props.country}
        <br />
        Created by: <span onClick={() => navigate(`/profile/${props.creator}`)}>{props.username}</span>, on {props.date_created}
      </div>


      <button type='submit' onClick={() => navigate(`/maps/${props.id}`, 
        { state: {
            id: props.id, 
            key: props.id,
            latitude: props.latitude,
            longitude: props.longitude,
            allPins: props.pins
          }
        }
      )}>
        View
      </button>
    </div>
  );
}
 
export default Map;

