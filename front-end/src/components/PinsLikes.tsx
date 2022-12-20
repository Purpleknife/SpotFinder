import React from 'react';

import { useNavigate } from 'react-router-dom';

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
    <div>
      <p onClick={() => navigate(`/profile/${props.like_creator}`)}>{props.username}</p>
    </div>
  );
}
 
export default PinsLikes;