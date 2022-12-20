import { useState, useRef, useEffect } from 'react';

import { Marker, Popup, useMapEvents } from 'react-leaflet';

import { useCookies } from 'react-cookie';

import 'leaflet/dist/leaflet.css';
import L, { marker } from "leaflet";

import axios from 'axios';

interface AddPinProps {
  map_id: number;
  refetch: () => void;
  title: string;
  date_created: string;
  latitude: number;
  longitude: number;
  allPins: any[];
  uploadImage: () => void;
  pinImage: string;
}

const AddPin = (props: AddPinProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const user_id = cookies.user_id;

  const [pinPosition, setPinPosition] = useState({
    latitude: 0,
    longitude: 0
  });

  const markerRef = useRef<any>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);


  // Save the pin to the db:
  const savePin = async() => {
    return axios.post('/pins', {
      creator: user_id,
      map_id: props.map_id,
      title: titleInput.current!.value,
      description: descriptionInput.current!.value,
      latitude: pinPosition.latitude,
      longitude: pinPosition.longitude,
      image: props.pinImage
    })
      .then((res) => {
        console.log('add pin', res.data);
        props.refetch();
        markerRef.current.closePopup();
      })
      .catch((error) => {
        console.log(error.message);
      })
  };
  

  // This gets triggered whenever a user clicks on a point in a map:
  const map = useMapEvents({
    click: (event) => {
      setPinPosition({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });

      const marker = markerRef.current;
      marker.openPopup();
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
          Add title: 
          <input
            type='text'
            ref={titleInput}
          />
          <br />

          Add description: 
          <input
            type='text'
            ref={descriptionInput}          
          />
          <br />

          Upload image: 
          <input 
            type='file'
            className="uploadInput"
          />
          <button onClick={() => props.uploadImage()}>Load</button>
          <br />
          <button onClick={savePin}>Save</button>
        </Popup>
      </Marker>


  )
}
 
export default AddPin;