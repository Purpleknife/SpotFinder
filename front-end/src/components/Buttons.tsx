import React from 'react';

import { useNavigate } from 'react-router-dom';


interface ButtonsProps {
  map_id: number;
};


const Buttons = (props: ButtonsProps) => {
  const navigate = useNavigate();


  return (
    <button type='submit' onClick={() => navigate(`/maps/${props.map_id}`, 
        { state: {
            id: props.map_id }
        }
      )}>
        View
    </button>
  );
}
 
export default Buttons;