import React from 'react';

import MapView from './MapView';
import Buttons from './Buttons';

import './Favorites.scss';

import { useNavigate } from 'react-router-dom';

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
  date_liked: string;
  map_id_liked: number;
  refetch: () => void;
}


const Favorites = (props: FavoritesProps) => {
  const navigate = useNavigate();

  return (
    <div className='favorites'>
      <div className='fav_map'>
        <MapView refetch={props.refetch} key={props.id} id={props.id} title={props.title} date_created={props.date_created} latitude={props.latitude} longitude={props.longitude} allPins={props.pins} />
      </div>

      <div className='fave_info'>
        <span className='title'><i className="fa-sharp fa-solid fa-thumbtack"></i> {props.title}</span>
        
        <span className='location'><i className="fa-solid fa-location-dot"></i> {props.city}, {props.province}, {props.country}</span>
        
        <span className='created_by'><i className="fa-solid fa-user-secret"></i> Created by <span id='username' onClick={() => navigate(`/profile/${props.creator}`)}> {props.username}</span>, on {props.date_created}</span>
        
        <span className='liked_on'><i className="fa-solid fa-calendar-days"></i> Liked on {props.date_liked}</span>

      </div>
      
      <div className='fave_btn'>
        <Buttons map_id={props.id} refetch={props.refetch} creator={props.creator} />
      </div>
    </div>
  );
}
 
export default Favorites;