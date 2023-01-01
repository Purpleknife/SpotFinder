import React from 'react';

import MapView from './MapView';
import Buttons from './Buttons';

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

      <div className='contri_info'> 
        <span className='title'><i className="fa-sharp fa-solid fa-thumbtack"></i> {props.title}</span>
        
        <span className='location'><i className="fa-solid fa-location-dot"></i> {props.city}, {props.province}, {props.country}</span>
        
        <span className='created_by'><i className="fa-solid fa-user-secret"></i> Created by <span id='username' onClick={() => navigate(`/profile/${props.creator}`)}> {props.username}</span>, on {props.date_created}</span>
        
        <span className='last_contribution'> <i className="fa-solid fa-check"></i> <span id='contribution'>Last contribution:</span> <span id='type'>{props.contributions_type}</span>, {props.contributions_date}.</span>

      </div>
      
      <div className='contri_btn'>
        <Buttons map_id={props.id} refetch={props.refetch} creator={props.creator} />
      </div>

    </div>
  );
}
 
export default Contributions;