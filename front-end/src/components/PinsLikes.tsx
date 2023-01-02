import React from 'react';

import { useNavigate } from 'react-router-dom';

import './MapLikes.scss';

import moment from 'moment';

interface PinsLikesProps {
  date_liked: string;
  first_name: string;
  id: number;
  last_name: string;
  map_id: number;
  profile_image: string;
  like_creator: number;
  username: string;
};


const PinsLikes = (props: PinsLikesProps) => {
  const navigate = useNavigate();
  
  return (
    <div className='likes_list'>
      <img
        alt='like_img'
        src={props.profile_image}
      />
      <div className='info'>
      <span className='username' onClick={() => navigate(`/profile/${props.like_creator}`)}>{props.username}</span>
      
      <span className='date'><i className="fa-solid fa-calendar-days"></i> {moment(props.date_liked).format('LL')}</span>
      </div>
    </div>
  );
}
 
export default PinsLikes;