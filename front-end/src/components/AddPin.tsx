import { useState, useRef, useEffect } from 'react';

import { Marker, Popup, useMapEvents } from 'react-leaflet';

import { useCookies } from 'react-cookie';

import 'leaflet/dist/leaflet.css';
import L, { marker } from "leaflet";

import axios from 'axios';

import './AddPin.scss';

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
  const loggedIn = cookies.logged_in;

  const [pinPosition, setPinPosition] = useState({
    latitude: 0,
    longitude: 0
  });

  const markerRef = useRef<any>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);

  
  // Change the contribution type that shows up in the profile:
  const changeContributionType = async() => {
    return axios.put(`/maps/contribution_type/${user_id}/${props.map_id}`, {
      contribution_type: 'Added Pin'
    })
      .then((res) => {
        console.log('contributions type', res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

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
        props.refetch();
        markerRef.current.closePopup();
        changeContributionType();
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

          {loggedIn ?
          <>
          <div id='pin_title'>Add title: 
          <input
            className='input_title'
            type='text'
            ref={titleInput}
          />
          </div>
          <br />

          <div id='pin_description'>Add description: 
          <input
            className='input_description'
            type='text'
            ref={descriptionInput}          
          />
          </div>
          <br />

          <div id='upload'>Upload image: 
            <input 
              type='file'
              className="uploadInput"
            />
            <button onClick={() => props.uploadImage()}>Load</button>
          </div>

          <button id='save' onClick={savePin}>Save</button>
          </>
        : <span>Please login to add a pin.</span>}
        </Popup>
      </Marker>


  )
}
 
export default AddPin;