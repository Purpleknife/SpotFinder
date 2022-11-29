import React from 'react';

import MapView from './MapView';

import './Contributions.scss';

interface ContributionsProps {
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
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  profile_image: string;
  user_country: string;
  user_id: number;
  user_province: string;
  contributions: string;
};


const Contributions = (props: ContributionsProps) => {

  return (
    <div className='contributions'>
      <div className='contri_map'>
        <MapView key={props.id} id={props.id} latitude={props.latitude} longitude={props.longitude} allPins={props.pins} />
      </div>
      Title: {props.title}
      <br />
      Location: {props.city}, {props.province}, {props.country}
      <br />
      Created by {props.username} on {props.date_created}
      <br /> Last contribution: {props.contributions}
    </div>
  );
}
 
export default Contributions;