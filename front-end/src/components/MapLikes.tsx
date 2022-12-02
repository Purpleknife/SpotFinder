import React from 'react';

import { useNavigate } from 'react-router-dom';

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
    <div>
      <p onClick={() => navigate(`/profile/${props.like_creator}`)}>{props.username}</p>
    </div>
  );
}
 
export default MapLikes;