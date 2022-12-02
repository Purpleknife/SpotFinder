import { useEffect, useState } from 'react';


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
}

const MapView = (props: MapViewProps) => {
  const [pinList, setPinList] = useState<any>([]);

  const generatePins = () => {
    if (props.allPins.length) {
      const pinsForMaps = props.allPins.map((pin) => {
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
      });
      setPinList(pinsForMaps);
    }
  };

  useEffect(() => {
    if (props.allPins.length) {
      generatePins();
    }
  }, [props.allPins.length])


  return (

    <MapContainer center={[props.latitude, props.longitude]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      { props.allPins.length && pinList}

    </MapContainer>

  );
}
 
export default MapView;