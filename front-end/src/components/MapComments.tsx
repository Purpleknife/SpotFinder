import React from 'react';


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
};


const MapComments = (props: MapCommentsProps) => {
  return (
    <div className='comments'>
      {props.username}
      {props.date_commented}
      {props.content}
    </div>
  );
}
 
export default MapComments;