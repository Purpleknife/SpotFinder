import React from 'react';

import axios from 'axios';

import { useCookies } from 'react-cookie';

interface MapCommentsProps {
  content: string;
  date_commented: string;
  first_name: string;
  id: number;
  last_name: string;
  map_id: number;
  profile_image: string;
  comment_creator: number;
  username: string;
  refetch: () => void;
};


const MapComments = (props: MapCommentsProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in', 'alreadyLiked', 'pinLiked']);
  const user_id = Number(cookies.user_id);

  // Delete a comment:
  const deleteComment = async() => {
    return axios.delete(`/maps/${props.map_id}/${props.id}/${user_id}`)
      .then((res) => {
        props.refetch();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  return (
    <div className='comments'>
      {props.username}
      {props.date_commented}
      {props.content}

      { props.comment_creator === user_id && <button onClick={deleteComment}>Delete</button> }
    </div>
  );
}
 
export default MapComments;