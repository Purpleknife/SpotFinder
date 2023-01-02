import React from 'react';

import { useNavigate } from 'react-router-dom';

import './MapLikes.scss';

interface MapLikesProps {
  date_liked: string;
  first_name: string;
  id: number;
  last_name: string;
  map_id: number;
  profile_image: string;
  like_creator: number;
  username: string;
};


const MapLikes = (props: MapLikesProps) => {
  const navigate = useNavigate();
  
  return (
    <div className='likes_list'>
      <div className='one_like'>
      <img
        alt='like_img'
        src={props.profile_image}
      />
      <div className='info'>
      <span className='username' onClick={() => navigate(`/profile/${props.like_creator}`)}>{props.username}</span>
      
      <span className='date'><i className="fa-solid fa-calendar-days"></i> {props.date_liked}</span>
      </div>
      </div>
    </div>
  );
}
 
export default MapLikes;