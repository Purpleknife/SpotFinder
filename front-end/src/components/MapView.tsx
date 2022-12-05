import { MapContainer, TileLayer } from 'react-leaflet';

import './MapView.scss';

import Pins from './Pins';

interface MapViewProps {
  id: number;
  key: number;
  title: string;
  date_created: string;
  latitude: number;
  longitude: number;
  allPins: any[];
  refetch: () => void;
}



const MapView = (props: MapViewProps) => {
  console.log('ALL PINS', props.allPins);
  const pinsForMaps = props.allPins.map((pin) => {
    return (
      <Pins
        key={pin.id}
        id={pin.id}
        latitude={pin.latitude}
        longitude={pin.longitude}
        title={pin.title}
        description={pin.description}
        image={pin.image}
        refetch={props.refetch}
        map_id={props.id}
      />
    )
  });


  return (

    <MapContainer 
      center={[props.latitude, props.longitude]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pinsForMaps}
      {/* <AddPin map_id={props.id} refetch={props.refetch}/> */}

    </MapContainer>

  );
}
 
export default MapView;