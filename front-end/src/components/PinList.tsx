import React from 'react';

import './PinList.scss';


interface PinListProps {
  id: number;
  creator: number;
  title: string;
  date_created: string;
  description: string;
  image: string;
  map_id: number;
  latitude: number;
  longitude: number;
};

const PinList = (props: PinListProps) => {
  return (
    <div className='pins_list'>
      <div className='img_pin'>
        <img
          alt='pin_img'
          src={props.image}
        /> <span className='title'>{props.title}</span>
      </div>

      <span className='description'>{props.description}</span>
    </div>
  );
}
 
export default PinList;