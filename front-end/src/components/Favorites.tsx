import React from 'react';

import MapView from './MapView';
import Buttons from './Buttons';

import './Favorites.scss';

interface FavoritesProps {
  id: number;
  title: string;
  city: string;
  province: string;
  country: string;
  creator: number;
  date_created: string;
  pins: any[];
  latitude: number;
  longitude: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  user_country: string;
  user_id: number;
  date_liked: number;
  map_id_liked: number;
  refetch: () => void;
}


const Favorites = (props: FavoritesProps) => {
  return (
    <div>
      <div className='fav_map'>
        <MapView refetch={props.refetch} key={props.id} id={props.id} title={props.title} date_created={props.date_created} latitude={props.latitude} longitude={props.longitude} allPins={props.pins} />
      </div>
      Title: {props.title}
      <br />
      Location: {props.city}, {props.province}, {props.country}
      <br />
      Created by {props.username} on {props.date_created}
      <br /> Date liked: {props.date_liked}

      <br />
      
      <Buttons map_id={props.id} refetch={props.refetch} creator={props.creator} />
    </div>
  );
}
 
export default Favorites;