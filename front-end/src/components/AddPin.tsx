import { useState, useRef, useEffect } from 'react';

import { Marker, Popup, useMapEvents } from 'react-leaflet';

import { useCookies } from 'react-cookie';

import { useLocation, useNavigate } from "react-router-dom";

import 'leaflet/dist/leaflet.css';
import L from "leaflet";

import axios from 'axios';

interface AddPinProps {
  map_id: number;
  refetch: () => void;
  title: string;
  date_created: string;
  latitude: number;
  longitude: number;
  allPins: any[];
}

const AddPin = (props: AddPinProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const user_id = cookies.user_id;

  const location = useLocation();
  const navigate = useNavigate();

  const [pinPosition, setPinPosition] = useState({
    latitude: 0,
    longitude: 0
  });

  const [pinImage, setPinImage] = useState<string>('');
  const [pinAdded, setPinAdded] = useState<boolean>(false);

  const markerRef = useRef<any>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);


  const uploadImage = async() => {
    const upload_preset: any = process.env.REACT_APP_UPLOAD_PRESET;
    const cloud_name = process.env.REACT_APP_CLOUDNAME;

    const files = document.querySelector<HTMLInputElement>(".uploadInput")!.files;
    const formData = new FormData();

    formData.append('file', files![0]);
    formData.append('upload_preset', upload_preset);
      axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      )
      .then(res => {
        setPinImage(res.data.secure_url);
        console.log('img uploaded');
      })
      .catch(error => {
        console.log('Upload error', error);
      })
  };


  const savePin = async() => {
    return axios.post('/pins', {
      creator: user_id,
      map_id: props.map_id,
      title: titleInput.current!.value,
      description: descriptionInput.current!.value,
      latitude: pinPosition.latitude,
      longitude: pinPosition.longitude,
      image: pinImage
    })
      .then((res) => {
        console.log('add pin', res.data);
        props.refetch();
      })
      .catch((error) => {
        console.log(error.message);
      })
  };

  // useEffect(() => {
  //   if (pinAdded) {
  //     props.refetch();
  //   }
  // }, [pinAdded]);

  


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
          <button onClick={uploadImage}>Load</button>
          <br />
          <button onClick={savePin}>Save</button>
        </Popup>
      </Marker>


  )
}
 
export default AddPin;