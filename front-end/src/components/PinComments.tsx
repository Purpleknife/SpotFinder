import React from 'react';

import axios from 'axios';

import { useCookies } from 'react-cookie';


interface PinCommentsProps {
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


const PinComments = (props: PinCommentsProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in', 'alreadyLiked', 'pinLiked']);
  const user_id = Number(cookies.user_id);

  // Delete a comment:
  const deletePinComment = async() => {
    return axios.delete(`/pins/${user_id}/${props.id}/${props.map_id}`)
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

      { props.comment_creator === user_id && <button onClick={deletePinComment}>Delete</button> }
    </div>
  );
}
 
export default PinComments;