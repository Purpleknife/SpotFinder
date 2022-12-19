import React from 'react';

import MapView from './MapView';

import './Contributions.scss';

import { useNavigate } from 'react-router-dom';

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
  contributions_type: string;
  contributions_date: string;
  refetch: () => void;
};


const Contributions = (props: ContributionsProps) => {

  const navigate = useNavigate();

  return (
    <div className='contributions'>
      <div className='contri_map'>
        <MapView refetch={props.refetch} key={props.id} id={props.id} title={props.title} date_created={props.date_created} latitude={props.latitude} longitude={props.longitude} allPins={props.pins} />
      </div>
      Title: {props.title}
      <br />
      Location: {props.city}, {props.province}, {props.country}
      <br />
      Created by {props.username} on {props.date_created}
      <br /> Last contribution: {props.contributions_type}, {props.contributions_date}.

      <br />
      <button type='submit' onClick={() => navigate(`/maps/${props.id}`, 
        { state: {
            id: props.id }
        }
      )}>
        View
      </button>
    </div>
  );
}
 
export default Contributions;