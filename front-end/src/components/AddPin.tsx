import { useState, useRef } from 'react';

import { Marker, Popup, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import L from "leaflet";

const AddPin = () => {
  const [pinPosition, setPinPosition] = useState({
    latitude: 0,
    longitude: 0
  });

  const markerRef = useRef<any>(null);

  const map = useMapEvents({
    click: (event) => {
      console.log('map', map.getCenter().lat);

      console.log('event', event.latlng);
      setPinPosition({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });

      const marker = markerRef.current;
      console.log('marker', marker);
      //if (marker) {
        marker.openPopup();
      //}
    }
    
  });


  const icon = L.icon({ 
    iconUrl: "/images/marker-icon.png",
    iconSize: [26, 36], // Icon size.
    iconAnchor: [16,32], // Where the popup points.
    popupAnchor:  [0, 0]
  });

  return (
    pinPosition === null ? null :
      <Marker
        ref={markerRef}
        position={[pinPosition.latitude, pinPosition.longitude]}
        icon={icon}
      >
        <Popup autoPan={false}>
          Test
        </Popup>
      </Marker>


  )
}
 
export default AddPin;