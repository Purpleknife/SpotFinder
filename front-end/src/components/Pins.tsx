import { Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import L from "leaflet";

interface PinProps {
  id: number | string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  image: string;
}

const Pins = (props: PinProps) => {

  const icon = L.icon({ iconUrl: "/images/marker-icon.png" });

  return (
    <>
      <Marker position={[props.latitude, props.longitude]} icon={icon}>
        <Popup>
          {props.title} <br />
          <img
            className='pin_img'
            alt='pin_img'
            src={props.image}
          /><br />
          {props.description}
        </Popup>
      </Marker>
    </>
  );
}
 
export default Pins;