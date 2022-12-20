import React, { useState } from 'react';

import { MapContainer, TileLayer } from 'react-leaflet';

import './MapView.scss';

import Pins from './Pins';
import AddPin from './AddPin';

import axios from 'axios';

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
  const [pinImage, setPinImage] = useState<string>('');
  

  // To upload a picture when a pin is created or edited:
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


  // To load all the pins of a map:
  const pinsForMaps = props.allPins?.map((pin) => {
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
        creator={pin.creator}
        uploadImage={uploadImage}
        pinImage={pinImage}
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
      
      <AddPin 
        map_id={props.id}
        refetch={props.refetch}
        latitude={props.latitude}
        longitude={props.longitude}
        date_created={props.date_created}
        title={props.title}
        allPins={props.allPins}
        uploadImage={uploadImage}
        pinImage={pinImage}
      />

    </MapContainer>

  );
}
 
export default MapView;