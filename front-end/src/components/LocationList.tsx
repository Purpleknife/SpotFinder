import * as React from 'react';


interface LocationListProps {
  id: number;
  city: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
};

const LocationList = (props: LocationListProps) => {
  return (
    <>
      <option value={props.city}>{props.city}, {props.province}, {props.country}</option>
    </>
  );
}
 
export default LocationList;